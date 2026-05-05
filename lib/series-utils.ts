import { lowestPrice, slugify } from "@/lib/racket-utils";
import { cleanTraits } from "@/lib/racket-profiles";
import { specClass } from "@/lib/spec-classification";
import type { RacketListItem, Trait } from "@/lib/types";

export type RacketSeriesGroup = {
  key: string;
  brand: string;
  brandSlug: string;
  series: string;
  slug: string;
  variants: RacketListItem[];
  defaultVariant: RacketListItem;
};

export function seriesSlug(series: string) {
  return slugify(series);
}

export function seriesPath(group: Pick<RacketSeriesGroup, "brandSlug" | "slug">) {
  return `/series/${group.brandSlug}/${group.slug}`;
}

export function groupRacketsBySeries(rackets: RacketListItem[]) {
  const map = new Map<string, RacketListItem[]>();

  for (const racket of rackets) {
    const key = `${racket.brandSlug}::${seriesSlug(racket.series)}`;
    map.set(key, [...(map.get(key) ?? []), racket]);
  }

  return Array.from(map.entries())
    .map(([key, variants]) => {
      const first = variants[0];
      const sortedVariants = [...variants].sort(compareVariants);
      return {
        key,
        brand: first.brand,
        brandSlug: first.brandSlug,
        series: first.series,
        slug: seriesSlug(first.series),
        variants: sortedVariants,
        defaultVariant: selectDefaultVariant(sortedVariants)
      };
    })
    .sort((a, b) => `${a.brand} ${a.series}`.localeCompare(`${b.brand} ${b.series}`));
}

export function selectDefaultVariant(variants: RacketListItem[]) {
  return [...variants].sort((a, b) => variantScore(b) - variantScore(a))[0];
}

export function variantLabel(racket: RacketListItem) {
  return racket.variantLabel || racket.name.replace(new RegExp(`^${escapeRegExp(racket.series)}\\s*`, "i"), "").trim() || racket.name;
}

export function variantMeta(racket: RacketListItem) {
  return {
    label: variantLabel(racket),
    modelYear: racket.modelYear?.toString() ?? inferYear(racket.name),
    generation: racket.generation ?? inferGeneration(racket.name),
    colorway: racket.colorway ?? "未标注"
  };
}

export function groupTraits(group: RacketSeriesGroup): Trait[] {
  const traits = new Set<Trait>();
  for (const variant of group.variants) {
    cleanTraits(variant.traits).forEach((trait) => traits.add(trait));
  }
  return Array.from(traits);
}

export function groupSpecClasses(group: RacketSeriesGroup) {
  return Array.from(new Set(group.variants.map((variant) => specClass(variant.spec))));
}

export function groupPrice(group: RacketSeriesGroup) {
  const prices = group.variants.map((variant) => lowestPrice(variant)).filter(Boolean);
  if (!prices.length) return null;
  return prices.reduce((lowest, price) => (price!.amount < lowest!.amount ? price : lowest), prices[0]);
}

export function groupSpecSummary(group: RacketSeriesGroup) {
  const headSizes = uniqueNumbers(group.variants.map((variant) => variant.spec?.headSizeSqIn));
  const weights = uniqueNumbers(group.variants.map((variant) => variant.spec?.unstrungWeightG));
  const patterns = Array.from(new Set(group.variants.map((variant) => variant.spec?.stringPattern).filter(Boolean))) as string[];

  return {
    head: rangeText(headSizes),
    weight: weights.length > 1 ? `${Math.min(...weights)}-${Math.max(...weights)}g` : weights[0] ? `${weights[0]}g` : "待补",
    patterns: patterns.length ? patterns.join(" / ") : "待补"
  };
}

export function groupMatches(group: RacketSeriesGroup, filters: {
  query: string;
  brand: string;
  trait: string;
  specGroup: string;
  priceBand: string;
  weight: string;
  head: string;
}) {
  const q = filters.query.trim().toLowerCase();
  const text = [
    group.brand,
    group.series,
    ...group.variants.map((variant) => variant.name),
    ...groupTraits(group),
    ...groupSpecClasses(group)
  ].join(" ").toLowerCase();

  return (
    (!q || text.includes(q)) &&
    (filters.brand === "全部品牌" || group.brand === filters.brand) &&
    group.variants.some((variant) => variantMatches(variant, filters))
  );
}

function variantMatches(racket: RacketListItem, filters: Omit<Parameters<typeof groupMatches>[1], "query" | "brand">) {
  const spec = racket.spec;
  const traits = cleanTraits(racket.traits);
  const price = lowestPrice(racket);
  const matchesTrait = filters.trait === "全部特点" || traits.includes(filters.trait as Trait);
  const matchesSpecGroup = filters.specGroup === "全部规格" || specClass(spec) === filters.specGroup;
  const matchesPrice = filters.priceBand === "ALL" || racket.prices.some((candidate) => matchesPriceBand(candidate, filters.priceBand));
  const matchesWeight =
    filters.weight === "ALL" ||
    (filters.weight === "LIGHT" && (spec?.unstrungWeightG ?? 999) <= 285) ||
    (filters.weight === "MID" && (spec?.unstrungWeightG ?? 0) > 285 && (spec?.unstrungWeightG ?? 999) <= 305) ||
    (filters.weight === "HEAVY" && (spec?.unstrungWeightG ?? 0) > 305);
  const matchesHead =
    filters.head === "ALL" ||
    (filters.head === "SMALL" && (spec?.headSizeSqIn ?? 999) <= 98) ||
    (filters.head === "MID" && (spec?.headSizeSqIn ?? 0) > 98 && (spec?.headSizeSqIn ?? 999) <= 100) ||
    (filters.head === "OVERSIZE" && (spec?.headSizeSqIn ?? 0) > 100);

  return matchesTrait && matchesSpecGroup && Boolean(price) && matchesPrice && matchesWeight && matchesHead;
}

function matchesPriceBand(price: RacketListItem["prices"][number], band: string) {
  if (price.currency !== "CNY" && price.region !== "CN") return false;
  if (band === "BUDGET") return price.amount <= 1600;
  if (band === "MID") return price.amount > 1600 && price.amount <= 2000;
  return price.amount > 2000;
}

function variantScore(racket: RacketListItem) {
  const spec = racket.spec;
  const price = lowestPrice(racket);
  let score = 0;
  score += generationRank(racket) * 6;
  if (price) score += 100;
  if (!racket.imageUrl.startsWith("data:image")) score += 30;
  if (spec?.headSizeSqIn === 100) score += 20;
  if (spec?.unstrungWeightG && Math.abs(spec.unstrungWeightG - 300) <= 5) score += 18;
  if (/100\b/.test(racket.name)) score += 10;
  return score;
}

function compareVariants(a: RacketListItem, b: RacketListItem) {
  return generationRank(b) - generationRank(a) || (a.spec?.headSizeSqIn ?? 999) - (b.spec?.headSizeSqIn ?? 999) || (a.spec?.unstrungWeightG ?? 999) - (b.spec?.unstrungWeightG ?? 999) || a.name.localeCompare(b.name);
}

function inferYear(name: string) {
  return name.match(/\b(20\d{2})\b/)?.[1] ?? "未标注";
}

function inferGeneration(name: string) {
  return name.match(/\b(v\d+)\b/i)?.[1] ?? "未标注";
}

function generationRank(racket: RacketListItem) {
  const generation = racket.generation ?? inferGeneration(racket.name);
  const version = generation.match(/v(\d+)/i)?.[1];
  if (version) return Number(version);
  if (racket.modelYear) return racket.modelYear / 100;
  return 0;
}

function uniqueNumbers(values: Array<number | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is number => typeof value === "number"))).sort((a, b) => a - b);
}

function rangeText(values: number[]) {
  if (!values.length) return "待补";
  if (values.length === 1) return `${values[0]}`;
  return `${values[0]}-${values[values.length - 1]}`;
}

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
