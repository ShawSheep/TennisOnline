"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpDown, Check, ExternalLink, Search, SlidersHorizontal, X } from "lucide-react";
import { formatPrice } from "@/lib/racket-utils";
import { SPEC_CLASSES, specClass, type SpecClass } from "@/lib/spec-classification";
import { TRAITS, type RacketListItem, type Trait } from "@/lib/types";
import { groupMatches, groupPrice, groupRacketsBySeries, groupSpecClasses, groupSpecSummary, groupTraits, seriesPath, type RacketSeriesGroup } from "@/lib/series-utils";
import { RacketImage } from "@/components/racket-image";

type Props = {
  rackets: RacketListItem[];
  lastSync: string | null;
};

type SortKey = "relevance" | "variants";

export function RacketBrowser({ rackets, lastSync }: Props) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("全部品牌");
  const [trait, setTrait] = useState<Trait | "全部特点">("全部特点");
  const [specGroup, setSpecGroup] = useState<SpecClass | "全部规格">("全部规格");
  const [sort, setSort] = useState<SortKey>("relevance");
  const [compareKeys, setCompareKeys] = useState<string[]>([]);

  const brands = useMemo(() => ["全部品牌", ...Array.from(new Set(rackets.map((racket) => racket.brand)))], [rackets]);
  const groups = useMemo(() => groupRacketsBySeries(rackets), [rackets]);

  const filtered = useMemo(() => {
    const items = groups.filter((group) => groupMatches(group, { query, brand, trait, specGroup, priceBand: "ALL", weight: "ALL", head: "ALL" }));

    return [...items].sort((a, b) => {
      if (sort === "variants") return b.variants.length - a.variants.length || `${a.brand} ${a.series}`.localeCompare(`${b.brand} ${b.series}`);
      return `${a.brand} ${a.series}`.localeCompare(`${b.brand} ${b.series}`);
    });
  }, [brand, groups, query, sort, specGroup, trait]);

  const compared = groups.filter((group) => compareKeys.includes(group.key));

  function toggleCompare(key: string) {
    setCompareKeys((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key);
      if (current.length >= 4) return current;
      return [...current, key];
    });
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4]/88 px-4 py-5 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="lg:col-span-2">
            <h1 className="max-w-full whitespace-nowrap bg-gradient-to-r from-ink via-court to-[#6f9f45] bg-clip-text text-[clamp(2.7rem,7.1vw,6.5rem)] font-black uppercase leading-none tracking-normal text-transparent">
              Tennis Online
            </h1>
            <p className="mt-4 text-3xl font-bold leading-tight text-court sm:text-4xl">网球球拍装备库</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70">
              按品牌、打法特点、规格和多地区参考价快速筛选热门球拍，适合选购前做第一轮比较。
            </p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white/90 p-4 shadow-sm lg:col-start-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">收录球拍</span>
              <span className="text-3xl font-bold text-court">{rackets.length}</span>
            </div>
            <div className="mt-3 text-sm text-ink/60">
              最新同步：{lastSync ? new Date(lastSync).toLocaleString("zh-CN") : "暂无记录"}
            </div>
          </div>
        </header>

        <section className="sticky top-0 z-20 rounded-lg border border-ink/10 bg-white/95 p-3 shadow-soft backdrop-blur">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_repeat(4,minmax(140px,auto))]">
            <label className="block">
              <span className="mb-1 block h-[18px] text-xs font-semibold text-transparent">搜索</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索品牌、型号、系列"
                  className="h-11 w-full rounded-md border border-ink/10 bg-line/70 pl-10 pr-3 outline-none transition focus:border-court focus:bg-white"
                />
              </div>
            </label>
            <FilterSelect label="品牌" value={brand} onChange={setBrand} options={brands} />
            <FilterSelect label="特点" value={trait} onChange={(value) => setTrait(value as Trait | "全部特点")} options={["全部特点", ...TRAITS]} />
            <FilterSelect label="规格" value={specGroup} onChange={(value) => setSpecGroup(value as SpecClass | "全部规格")} options={["全部规格", ...SPEC_CLASSES]} />
            <FilterSelect
              label="排序"
              value={sort}
              onChange={(value) => setSort(value as SortKey)}
              options={["relevance", "variants"]}
              optionLabels={{ relevance: "品牌系列", variants: "版本数量" }}
              icon={<ArrowUpDown size={15} />}
            />
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="mb-3 flex items-center justify-between text-sm text-ink/60">
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal size={16} />
                当前显示 {filtered.length} 个系列 / 共 {rackets.length} 支变体
              </span>
              <span>最多选择 4 支对比</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((group) => (
                <SeriesCard
                  key={group.key}
                  group={group}
                  selected={compareKeys.includes(group.key)}
                  disabled={!compareKeys.includes(group.key) && compareKeys.length >= 4}
                  onToggleCompare={() => toggleCompare(group.key)}
                />
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-[104px] lg:self-start">
            <ComparePanel rackets={compared} onRemove={(id) => toggleCompare(id)} />
          </aside>
        </section>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  optionLabels,
  icon,
  onChange
}: {
  label: string;
  value: string;
  options: readonly string[];
  optionLabels?: Record<string, string>;
  icon?: ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-ink/55">
        {icon}
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-ink/10 bg-line/70 px-3 outline-none transition focus:border-court focus:bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SeriesCard({
  group,
  selected,
  disabled,
  onToggleCompare
}: {
  group: RacketSeriesGroup;
  selected: boolean;
  disabled: boolean;
  onToggleCompare: () => void;
}) {
  const variant = group.defaultVariant;
  const price = groupPrice(group);
  const category = groupSpecClasses(group)[0] ?? specClass(variant.spec);
  const traits = groupTraits(group);
  const summary = groupSpecSummary(group);

  return (
    <article className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={seriesPath(group)} className="block">
        <div className="racket-card-image aspect-[4/3] overflow-hidden">
          <RacketImage
            src={variant.imageUrl}
            brand={group.brand}
            name={group.series}
            className="h-full w-full object-contain p-5 transition duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-court">{group.brand}</p>
          <Link href={seriesPath(group)} className="mt-1 block min-h-12 text-xl font-bold leading-tight hover:text-court">
            {group.series}
          </Link>
          <p className="mt-1 text-sm text-ink/55">{group.variants.length} 个版本 · 默认 {variant.name}</p>
        </div>
        <div className="flex min-h-8 flex-wrap gap-1.5">
          <span className="rounded-full bg-court/10 px-2.5 py-1 text-xs font-semibold text-court">
            {category}
          </span>
          {traits.slice(0, 4).map((item) => (
            <span key={item} className="rounded-full bg-line px-2.5 py-1 text-xs font-semibold text-ink/70">
              {item}
            </span>
          ))}
        </div>
        <dl className="grid grid-cols-3 gap-2 text-sm">
          <SpecCell label="版本" value={`${group.variants.length}`} />
          <SpecCell label="拍面" value={summary.head} />
          <SpecCell label="重量" value={summary.weight} />
          <SpecCell label="线床" value={summary.patterns} />
          <SpecCell label="最低价" value={price ? formatPrice(price.currency, price.amount) : "待补"} />
          <SpecCell label="默认款" value={variant.name.replace(group.series, "").trim() || "标准"} />
        </dl>
        <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
          <div>
            <p className="text-xs text-ink/55">最低参考价</p>
            <p className="text-lg font-bold text-court">{price ? formatPrice(price.currency, price.amount) : "待补充"}</p>
          </div>
          <button
            type="button"
            onClick={onToggleCompare}
            disabled={disabled}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition hover:border-court hover:text-court disabled:cursor-not-allowed disabled:opacity-40"
            title={selected ? "从对比移除" : "加入对比"}
          >
            {selected ? <Check size={18} /> : <SlidersHorizontal size={18} />}
          </button>
        </div>
      </div>
    </article>
  );
}

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-line/80 p-2">
      <dt className="text-xs text-ink/50">{label}</dt>
      <dd className="mt-1 truncate font-semibold">{value}</dd>
    </div>
  );
}

function ComparePanel({ rackets, onRemove }: { rackets: RacketSeriesGroup[]; onRemove: (key: string) => void }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">对比栏</h2>
        <span className="text-sm text-ink/55">{rackets.length}/4</span>
      </div>
      {rackets.length < 2 ? (
        <p className="mt-4 rounded-md bg-line p-4 text-sm leading-6 text-ink/65">选择 2 到 4 个系列后，这里会并排比较默认变体、版本数、拍面、线床和价格。</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[320px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="w-24 border-b border-ink/10 p-2 text-left text-ink/55">项目</th>
                {rackets.map((group) => (
                  <th key={group.key} className="border-b border-ink/10 p-2 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <span className="leading-tight">{group.series}</span>
                      <button
                        type="button"
                        onClick={() => onRemove(group.key)}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink/50 hover:bg-line hover:text-ink"
                        title="移除"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["品牌", (g: RacketSeriesGroup) => g.brand],
                ["版本", (g: RacketSeriesGroup) => `${g.variants.length} 个`],
                ["默认款", (g: RacketSeriesGroup) => g.defaultVariant.name],
                ["特点", (g: RacketSeriesGroup) => groupTraits(g).slice(0, 3).join(" / ") || specClass(g.defaultVariant.spec)],
                ["拍面", (g: RacketSeriesGroup) => groupSpecSummary(g).head],
                ["线床", (g: RacketSeriesGroup) => groupSpecSummary(g).patterns],
                ["价格", (g: RacketSeriesGroup) => {
                  const price = groupPrice(g);
                  return price ? formatPrice(price.currency, price.amount) : "待补";
                }]
              ].map(([label, getter]) => (
                <tr key={label as string}>
                  <td className="border-b border-ink/10 p-2 text-ink/55">{label as string}</td>
                  {rackets.map((group) => (
                    <td key={group.key} className="border-b border-ink/10 p-2 align-top">
                      {(getter as (group: RacketSeriesGroup) => string)(group)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 space-y-2">
        {rackets.map((group) => (
          <Link key={group.key} href={seriesPath(group)} className="flex items-center justify-between rounded-md bg-line px-3 py-2 text-sm font-semibold hover:text-court">
            {group.brand} {group.series}
            <ExternalLink size={14} />
          </Link>
        ))}
      </div>
    </div>
  );
}
