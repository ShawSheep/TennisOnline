import { prisma } from "@/lib/prisma";
import type { RacketListItem, Trait } from "@/lib/types";

export async function getRackets(): Promise<RacketListItem[]> {
  const rackets = await prisma.racket.findMany({
    include: {
      brand: true,
      spec: true,
      prices: {
        include: { source: true },
        orderBy: [{ region: "asc" }, { amount: "asc" }]
      }
    },
    orderBy: [{ brand: { name: "asc" } }, { series: "asc" }, { name: "asc" }]
  });

  return rackets.map((racket) => ({
    id: racket.id,
    slug: racket.slug,
    brand: racket.brand.name,
    brandSlug: racket.brand.slug,
    name: racket.name,
    series: racket.series,
    imageUrl: racket.imageUrl,
    imageSourceUrl: racket.imageSourceUrl,
    sourceUrl: racket.sourceUrl,
    modelYear: racket.modelYear,
    generation: racket.generation,
    colorway: racket.colorway,
    variantLabel: racket.variantLabel,
    traits: JSON.parse(racket.traits) as Trait[],
    audience: racket.audience,
    description: racket.description,
    spec: racket.spec
      ? {
          headSizeSqIn: racket.spec.headSizeSqIn,
          lengthIn: racket.spec.lengthIn,
          unstrungWeightG: racket.spec.unstrungWeightG,
          swingWeight: racket.spec.swingWeight,
          balanceMm: racket.spec.balanceMm,
          stringPattern: racket.spec.stringPattern,
          stiffnessRa: racket.spec.stiffnessRa
        }
      : null,
    prices: racket.prices.map((price) => ({
      currency: price.currency,
      region: price.region,
      amount: price.amount,
      productUrl: price.productUrl,
      fetchedAt: price.fetchedAt.toISOString(),
      sourceName: price.source.name,
      sourceUrl: price.source.url
    }))
  }));
}

export async function getRacket(slug: string) {
  const rackets = await getRackets();
  return rackets.find((racket) => racket.slug === slug) ?? null;
}

export async function getLastSync() {
  return prisma.syncRun.findFirst({
    orderBy: { startedAt: "desc" }
  });
}
