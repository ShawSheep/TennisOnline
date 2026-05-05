import { PrismaClient } from "@prisma/client";
import { racketSeeds } from "@/lib/seed-data";
import { normalizeModelName, slugify } from "@/lib/racket-utils";

const prisma = new PrismaClient();

async function main() {
  for (const seed of racketSeeds) {
    const brand = await prisma.brand.upsert({
      where: { slug: seed.brandSlug },
      update: {
        name: seed.brand,
        websiteUrl: seed.brandWebsiteUrl,
        logoUrl: seed.brandLogoUrl
      },
      create: {
        name: seed.brand,
        slug: seed.brandSlug,
        websiteUrl: seed.brandWebsiteUrl,
        logoUrl: seed.brandLogoUrl
      }
    });

    const racket = await prisma.racket.upsert({
      where: {
        brandId_normalizedName_series: {
          brandId: brand.id,
          normalizedName: normalizeModelName(seed.name),
          series: seed.series
        }
      },
      update: {
        name: seed.name,
        slug: slugify(`${seed.brandSlug}-${seed.name}`),
        variantLabel: seed.variantLabel ?? seed.name,
        modelYear: seed.modelYear ?? null,
        generation: seed.generation ?? null,
        colorway: seed.colorway ?? null,
        imageUrl: seed.imageUrl,
        imageSourceUrl: seed.imageSourceUrl,
        sourceUrl: seed.sourceUrl,
        traits: JSON.stringify(seed.traits),
        audience: seed.audience,
        description: seed.description
      },
      create: {
        brandId: brand.id,
        name: seed.name,
        normalizedName: normalizeModelName(seed.name),
        slug: slugify(`${seed.brandSlug}-${seed.name}`),
        series: seed.series,
        variantLabel: seed.variantLabel ?? seed.name,
        modelYear: seed.modelYear ?? null,
        generation: seed.generation ?? null,
        colorway: seed.colorway ?? null,
        imageUrl: seed.imageUrl,
        imageSourceUrl: seed.imageSourceUrl,
        sourceUrl: seed.sourceUrl,
        traits: JSON.stringify(seed.traits),
        audience: seed.audience,
        description: seed.description
      }
    });

    await prisma.racketSpec.upsert({
      where: { racketId: racket.id },
      update: seed.spec,
      create: {
        racketId: racket.id,
        ...seed.spec
      }
    });

    for (const priceSeed of seed.prices) {
      const source = await prisma.source.upsert({
        where: { name: priceSeed.sourceName },
        update: {
          region: priceSeed.region,
          url: priceSeed.sourceUrl,
          confidence: priceSeed.confidence,
          ruleKey: priceSeed.ruleKey
        },
        create: {
          name: priceSeed.sourceName,
          region: priceSeed.region,
          url: priceSeed.sourceUrl,
          confidence: priceSeed.confidence,
          ruleKey: priceSeed.ruleKey
        }
      });

      await prisma.price.upsert({
        where: {
          racketId_sourceId_currency_region: {
            racketId: racket.id,
            sourceId: source.id,
            currency: priceSeed.currency,
            region: priceSeed.region
          }
        },
        update: {
          amount: priceSeed.amount,
          productUrl: priceSeed.productUrl,
          fetchedAt: new Date(priceSeed.fetchedAt)
        },
        create: {
          racketId: racket.id,
          sourceId: source.id,
          currency: priceSeed.currency,
          region: priceSeed.region,
          amount: priceSeed.amount,
          productUrl: priceSeed.productUrl,
          fetchedAt: new Date(priceSeed.fetchedAt)
        }
      });
    }
  }

  await prisma.syncRun.create({
    data: {
      sourceName: "curated-seed",
      status: "success",
      finishedAt: new Date(),
      imported: racketSeeds.length
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
