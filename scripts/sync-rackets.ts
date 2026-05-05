import { PrismaClient } from "@prisma/client";
import { racketSeeds } from "@/lib/seed-data";
import { findOfferForModel, parseProductOffers } from "@/lib/sync-parsers";
import { normalizeModelName, slugify } from "@/lib/racket-utils";

const prisma = new PrismaClient();

async function upsertSeedBaseline() {
  let imported = 0;

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
      create: { racketId: racket.id, ...seed.spec }
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

    imported += 1;
  }

  return imported;
}

async function updateFromSource(sourceUrl: string, sourceName: string) {
  const response = await fetch(sourceUrl, {
    headers: {
      "user-agent": "TennisOnlineBot/0.1 (+local prototype)"
    }
  });
  if (!response.ok) throw new Error(`${sourceName} responded ${response.status}`);

  const html = await response.text();
  const offers = parseProductOffers(html, sourceUrl);
  if (!offers.length) return 0;

  const rackets = await prisma.racket.findMany({
    include: { brand: true, prices: { include: { source: true } } }
  });

  let updated = 0;
  for (const racket of rackets) {
    const offer = findOfferForModel(offers, racket.name);
    if (!offer?.price) continue;

    const source = await prisma.source.upsert({
      where: { name: sourceName },
      update: {
        url: sourceUrl,
        region: offer.price.currency === "CNY" ? "CN" : "US",
        ruleKey: "generic-product-card",
        confidence: 65
      },
      create: {
        name: sourceName,
        url: sourceUrl,
        region: offer.price.currency === "CNY" ? "CN" : "US",
        ruleKey: "generic-product-card",
        confidence: 65
      }
    });

    await prisma.price.upsert({
      where: {
        racketId_sourceId_currency_region: {
          racketId: racket.id,
          sourceId: source.id,
          currency: offer.price.currency,
          region: offer.price.currency === "CNY" ? "CN" : "US"
        }
      },
      update: {
        amount: offer.price.amount,
        productUrl: offer.productUrl ?? sourceUrl,
        fetchedAt: new Date()
      },
      create: {
        racketId: racket.id,
        sourceId: source.id,
        currency: offer.price.currency,
        region: offer.price.currency === "CNY" ? "CN" : "US",
        amount: offer.price.amount,
        productUrl: offer.productUrl ?? sourceUrl,
        fetchedAt: new Date()
      }
    });

    if (offer.imageUrl) {
      await prisma.racket.update({
        where: { id: racket.id },
        data: {
          imageUrl: offer.imageUrl,
          imageSourceUrl: offer.productUrl ?? sourceUrl
        }
      });
    }

    updated += 1;
  }

  return updated;
}

async function main() {
  const run = await prisma.syncRun.create({
    data: {
      sourceName: "all-configured-sources",
      status: "running"
    }
  });

  try {
    const baselineCount = await upsertSeedBaseline();
    const sources = [
      ["Babolat 官网", "https://www.babolat.com/us/tennis/racquets.html"],
      ["Wilson 官网", "https://www.wilson.com/en-us/tennis/rackets/"],
      ["优个网", "https://www.yoger.com.cn/products_1214.html"],
      ["动库商城", "https://www.dku51.com/price_list-219.html"]
    ] as const;

    let updated = 0;
    const errors: string[] = [];
    for (const [sourceName, sourceUrl] of sources) {
      try {
        updated += await updateFromSource(sourceUrl, sourceName);
      } catch (error) {
        errors.push(`${sourceName}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    await prisma.syncRun.update({
      where: { id: run.id },
      data: {
        status: errors.length ? "partial_success" : "success",
        finishedAt: new Date(),
        imported: baselineCount + updated,
        error: errors.length ? errors.join("\n") : null
      }
    });

    console.log(`Synced ${baselineCount} baseline rackets and ${updated} live offers.`);
    if (errors.length) console.warn(errors.join("\n"));
  } catch (error) {
    await prisma.syncRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        finishedAt: new Date(),
        error: error instanceof Error ? error.message : String(error)
      }
    });
    throw error;
  }
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
