"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PlayerCard } from "@/components/player-card";
import { RacketImage } from "@/components/racket-image";
import { formatPrice, lowestPrice } from "@/lib/racket-utils";
import { cleanText, cleanTraits, racketIntro, racketPlayers } from "@/lib/racket-profiles";
import { specBadges, specClass } from "@/lib/spec-classification";
import { groupPrice, groupSpecSummary, groupTraits, variantMeta, type RacketSeriesGroup } from "@/lib/series-utils";
import type { RacketListItem } from "@/lib/types";

type Props = {
  group: RacketSeriesGroup;
};

export function SeriesDetail({ group }: Props) {
  const [selectedId, setSelectedId] = useState(group.defaultVariant.id);
  const selected = group.variants.find((variant) => variant.id === selectedId) ?? group.defaultVariant;
  const prices = selected.prices
    .filter((price) => price.currency === "CNY" || price.region === "CN")
    .sort((a, b) => a.amount - b.amount);
  const selectedPrice = lowestPrice(selected);
  const intro = racketIntro(selected);
  const players = racketPlayers(selected);
  const traits = cleanTraits(selected.traits);
  const category = specClass(selected.spec);
  const badges = specBadges(selected.spec);
  const summary = groupSpecSummary(group);
  const allTraits = groupTraits(group);
  const meta = variantMeta(selected);
  const variantOptions = useMemo(() => group.variants, [group.variants]);
  const variantGroups = useMemo(() => groupVariantsByGeneration(variantOptions), [variantOptions]);

  const specRows = [
    ["拍面", selected.spec?.headSizeSqIn ? `${selected.spec.headSizeSqIn} sq in` : "待补充"],
    ["长度", selected.spec?.lengthIn ? `${selected.spec.lengthIn} in` : "待补充"],
    ["未穿线重量", selected.spec?.unstrungWeightG ? `${selected.spec.unstrungWeightG} g` : "待补充"],
    ["挥重", selected.spec?.swingWeight ?? "待补充"],
    ["平衡点", selected.spec?.balanceMm ? `${selected.spec.balanceMm} mm` : "待补充"],
    ["线床", selected.spec?.stringPattern ?? "待补充"],
    ["硬度", selected.spec?.stiffnessRa ? `${selected.spec.stiffnessRa} RA` : "待补充"],
    ["年份", meta.modelYear],
    ["代际", meta.generation],
    ["配色", meta.colorway]
  ];

  return (
    <main className="min-h-screen bg-[#f7f8f4]/95 px-4 py-6 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-sm font-medium shadow-sm transition hover:border-court hover:text-court"
        >
          <ArrowLeft size={16} />
          返回装备库
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div>
            <div className="overflow-hidden rounded-lg bg-white shadow-soft">
              <RacketImage
                src={selected.imageUrl}
                brand={selected.brand}
                name={selected.name}
                className="h-[440px] w-full object-contain p-8"
              />
            </div>
            <a
              href={selected.imageSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-ink/60 hover:text-court"
            >
              图片来源
              <ExternalLink size={13} />
            </a>

            <div className="mt-4 rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-bold text-ink/60">版本 / 型号</h2>
              <div className="mt-3 space-y-4">
                {variantGroups.map((generationGroup) => (
                  <section key={generationGroup.key}>
                    <div className="flex items-center justify-between gap-3 border-b border-ink/10 pb-2">
                      <div>
                        <h3 className="text-base font-bold text-ink">{generationGroup.label}</h3>
                        <p className="mt-0.5 text-xs text-ink/55">
                          年份 {generationGroup.year} · 配色 {generationGroup.colorways.join(" / ")}
                        </p>
                      </div>
                      <span className="rounded-full bg-line px-2.5 py-1 text-xs font-bold text-ink/60">{generationGroup.variants.length} 款</span>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {generationGroup.variants.map((variant) => {
                        const active = variant.id === selected.id;
                        const optionMeta = variantMeta(variant);
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => setSelectedId(variant.id)}
                            className={`rounded-md border p-3 text-left transition ${
                              active ? "border-court bg-court/10 text-court" : "border-ink/10 bg-line/60 hover:border-court"
                            }`}
                          >
                            <span className="block text-sm font-bold">{optionMeta.label}</span>
                            <span className="mt-1 block text-xs text-ink/55">
                              拍面 {variant.spec?.headSizeSqIn ?? "待补"} · 重量 {variant.spec?.unstrungWeightG ? `${variant.spec.unstrungWeightG}g` : "待补"} · 线床 {variant.spec?.stringPattern ?? "待补"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-court">{group.brand}</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight">{group.series}</h1>
              <p className="mt-3 text-base leading-7 text-ink/70">
                共 {group.variants.length} 个版本，拍面 {summary.head}，重量 {summary.weight}，线床 {summary.patterns}。当前选择：{selected.name}。
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-clay/10 px-3 py-1 text-sm font-semibold text-clay">{category}</span>
              {(traits.length ? traits : allTraits).map((trait) => (
                <span key={trait} className="rounded-full bg-court/10 px-3 py-1 text-sm font-semibold text-court">
                  {trait}
                </span>
              ))}
            </div>

            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">当前变体参数</h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {specRows.map(([label, value]) => (
                  <div key={label} className="rounded-md bg-line/70 p-3">
                    <dt className="text-ink/55">{label}</dt>
                    <dd className="mt-1 font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">参考价格</h2>
              <p className="mt-2 text-2xl font-bold text-court">{selectedPrice ? formatPrice(selectedPrice.currency, selectedPrice.amount) : "待补充"}</p>
              <div className="mt-4 space-y-3">
                {prices.map((price) => (
                  <a
                    key={`${price.sourceName}-${price.region}-${price.currency}`}
                    href={price.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 rounded-md border border-ink/10 p-3 transition hover:border-court"
                  >
                    <span>
                      <span className="block text-sm font-semibold">{price.sourceName}</span>
                      <span className="text-xs text-ink/55">
                        {price.region} · {new Date(price.fetchedAt).toLocaleDateString("zh-CN")}
                      </span>
                    </span>
                    <span className="font-bold text-court">{formatPrice(price.currency, price.amount)}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">系列与当前版本介绍</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-ink/70">
              {(cleanText(selected.description) ? [cleanText(selected.description), ...intro.slice(1)] : intro).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 text-sm text-ink/70 sm:grid-cols-4">
              {badges.map((badge) => (
                <span key={badge} className="rounded-md bg-line/70 px-3 py-2 font-semibold">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-line/50 p-6 shadow-sm">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold">代表球员</h2>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  职业球员常用定制版本；这里列出使用过该系列或相近职业涂装的代表球员。
                </p>
              </div>
              <span className="inline-flex h-8 min-w-12 items-center justify-center whitespace-nowrap rounded-full bg-white px-3 text-xs font-bold leading-none text-court shadow-sm">
                {players.length} 位
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {players.map((player) => (
                <PlayerCard key={player.name} player={player} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function groupVariantsByGeneration(variants: RacketListItem[]) {
  const map = new Map<string, RacketListItem[]>();

  for (const variant of variants) {
    const meta = variantMeta(variant);
    const key = meta.generation === "未标注" ? `unknown-${meta.modelYear}` : meta.generation;
    map.set(key, [...(map.get(key) ?? []), variant]);
  }

  return Array.from(map.entries())
    .map(([key, items]) => {
      const metas = items.map(variantMeta);
      const generation = metas.find((item) => item.generation !== "未标注")?.generation ?? "未标注版本";
      const years = Array.from(new Set(metas.map((item) => item.modelYear).filter((item) => item !== "未标注")));
      const colorways = Array.from(new Set(metas.map((item) => item.colorway).filter((item) => item !== "未标注")));
      return {
        key,
        label: formatGenerationLabel(generation),
        year: years.join(" / ") || "未标注",
        colorways: colorways.length ? colorways : ["未标注"],
        variants: [...items].sort(compareModelVariant)
      };
    })
    .sort((a, b) => generationRank(b.key) - generationRank(a.key) || a.label.localeCompare(b.label));
}

function generationRank(key: string) {
  const version = key.match(/v(\d+)/i)?.[1];
  if (version) return Number(version);
  const year = key.match(/20\d{2}/)?.[0];
  return year ? Number(year) / 100 : 0;
}

function compareModelVariant(a: RacketListItem, b: RacketListItem) {
  return (
    (a.spec?.headSizeSqIn ?? 999) - (b.spec?.headSizeSqIn ?? 999) ||
    (a.spec?.unstrungWeightG ?? 999) - (b.spec?.unstrungWeightG ?? 999) ||
    variantMeta(a).label.localeCompare(variantMeta(b).label)
  );
}

function formatGenerationLabel(generation: string) {
  if (generation === "未标注版本") return generation;
  if (/^v\d+$/i.test(generation)) return generation.toUpperCase();
  if (/^gen\d+$/i.test(generation)) return `Gen${generation.replace(/\D/g, "")}`;
  return generation;
}
