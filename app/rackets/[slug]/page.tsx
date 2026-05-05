import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getRacket, getRackets } from "@/lib/data";
import { formatPrice } from "@/lib/racket-utils";
import { specBadges, specClass } from "@/lib/spec-classification";
import { cleanText, cleanTraits, racketIntro, racketPlayers } from "@/lib/racket-profiles";
import { PlayerCard } from "@/components/player-card";
import { RacketImage } from "@/components/racket-image";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const rackets = await getRackets();

  return rackets.map((racket) => ({
    slug: racket.slug
  }));
}

export default async function RacketDetailPage({ params }: Props) {
  const { slug } = await params;
  const racket = await getRacket(slug);
  if (!racket) notFound();

  const specRows = [
    ["拍面", racket.spec?.headSizeSqIn ? `${racket.spec.headSizeSqIn} sq in` : "待补充"],
    ["长度", racket.spec?.lengthIn ? `${racket.spec.lengthIn} in` : "待补充"],
    ["未穿线重量", racket.spec?.unstrungWeightG ? `${racket.spec.unstrungWeightG} g` : "待补充"],
    ["挥重", racket.spec?.swingWeight ?? "待补充"],
    ["平衡点", racket.spec?.balanceMm ? `${racket.spec.balanceMm} mm` : "待补充"],
    ["线床", racket.spec?.stringPattern ?? "待补充"],
    ["硬度", racket.spec?.stiffnessRa ? `${racket.spec.stiffnessRa} RA` : "待补充"]
  ];
  const prices = racket.prices
    .filter((price) => price.currency === "CNY" || price.region === "CN")
    .sort((a, b) => a.amount - b.amount);
  const category = specClass(racket.spec);
  const badges = specBadges(racket.spec);
  const intro = racketIntro(racket);
  const summary = cleanText(racket.description) || intro[0];
  const players = racketPlayers(racket);
  const traits = cleanTraits(racket.traits);

  return (
    <main className="min-h-screen bg-[#f7f8f4]/95 px-4 py-6 text-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-sm font-medium shadow-sm transition hover:border-court hover:text-court"
        >
          <ArrowLeft size={16} />
          返回球拍库
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="overflow-hidden rounded-lg bg-white shadow-soft">
              <RacketImage
                src={racket.imageUrl}
                brand={racket.brand}
                name={racket.name}
                className="h-[420px] w-full object-contain p-8"
              />
            </div>
            <a
              href={racket.imageSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-ink/60 hover:text-court"
            >
              图片来源
              <ExternalLink size={13} />
            </a>
          </div>

          <aside className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-court">{racket.brand}</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight">{racket.name}</h1>
              <p className="mt-3 text-base leading-7 text-ink/70">{summary}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-clay/10 px-3 py-1 text-sm font-semibold text-clay">
                {category}
              </span>
              {traits.map((trait) => (
                <span key={trait} className="rounded-full bg-court/10 px-3 py-1 text-sm font-semibold text-court">
                  {trait}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-ink/70">
              {badges.map((badge) => (
                <span key={badge} className="rounded-md bg-white px-3 py-2 font-semibold shadow-sm">
                  {badge}
                </span>
              ))}
            </div>

            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">核心参数</h2>
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
            <h2 className="text-xl font-bold">球拍介绍</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-ink/70">
              {intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-line/50 p-6 shadow-sm">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold">代表球员</h2>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  职业球员常用定制版本；这里列出使用过该型号、同系列或相近职业涂装的代表球员。
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
