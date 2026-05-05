import { TRAITS, type RacketListItem, type Trait } from "@/lib/types";

export function normalizeModelName(name: string) {
  return name
    .toLowerCase()
    .replace(/[™®]/g, "")
    .replace(/\b(v\d+|gen\s*\d+|202\d)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[™®]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function mapTraits(input: {
  series?: string;
  name?: string;
  headSizeSqIn?: number | null;
  unstrungWeightG?: number | null;
  stiffnessRa?: number | null;
  stringPattern?: string | null;
}): Trait[] {
  const text = `${input.series ?? ""} ${input.name ?? ""}`.toLowerCase();
  const traits = new Set<Trait>();

  if (/aero|spin|vcore|extreme|sx|beast/.test(text) || input.stringPattern === "16x19") traits.add("旋转");
  if (/drive|ultra|boom|power|ezone|beast|fx/.test(text) || (input.stiffnessRa ?? 0) >= 68) traits.add("力量");
  if (/blade|strike|speed|gravity|percept|phantom|tfight|cx|control/.test(text)) traits.add("控制");
  if (/clash|phantom|comfort|gravity|percept/.test(text) || (input.stiffnessRa ?? 99) <= 62) traits.add("舒适");
  if (/lite|team|feel|105|110/.test(text) || (input.unstrungWeightG ?? 999) <= 285) traits.add("轻量");
  if (/team|mp|100|105|110|lite/.test(text)) traits.add("进阶");
  if (/pro|tour|97|98|rf|prestige|tfight/.test(text) || (input.unstrungWeightG ?? 0) >= 305) traits.add("竞技");
  if (/pro staff|prestige|percept|phantom|cx|strike/.test(text)) traits.add("手感");

  return Array.from(traits).filter((trait) => TRAITS.includes(trait));
}

export function parsePriceText(text: string) {
  const normalized = text.replace(/,/g, "").trim();
  const cny = normalized.match(/(?:¥|￥|RMB|CNY)\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (cny) return { currency: "CNY", amount: Number(cny[1]) };

  const usd = normalized.match(/(?:\$|USD)\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (usd) return { currency: "USD", amount: Number(usd[1]) };

  return null;
}

export function formatPrice(currency: string, amount: number) {
  return new Intl.NumberFormat(currency === "CNY" ? "zh-CN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "CNY" ? 0 : 2
  }).format(amount);
}

export function lowestPrice(racket: RacketListItem, region: "ALL" | "US" | "CN" = "CN") {
  const prices =
    region === "ALL"
      ? racket.prices.filter((price) => price.region === "CN" || price.currency === "CNY")
      : racket.prices.filter((price) => price.region === region);
  if (!prices.length) return null;
  return prices.reduce((lowest, price) => (price.amount < lowest.amount ? price : lowest), prices[0]);
}
