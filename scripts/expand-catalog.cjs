const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const fetchedAt = new Date("2026-05-05T00:00:00.000Z");

const brands = {
  Wilson: { slug: "wilson", websiteUrl: "https://www.wilson.com/en-us/tennis/rackets", logoUrl: "https://www.wilson.com/favicon.ico", source: "Wilson 官网" },
  Babolat: { slug: "babolat", websiteUrl: "https://www.babolat.com/us/tennis/racquets.html", logoUrl: "https://www.babolat.com/favicon.ico", source: "Babolat 官网" },
  HEAD: { slug: "head", websiteUrl: "https://www.head.com/en_US/tennis/racquets.html", logoUrl: "https://www.head.com/favicon.ico", source: "HEAD 官网" },
  Yonex: { slug: "yonex", websiteUrl: "https://www.yonex.com/tennis/racquets", logoUrl: "https://www.yonex.com/favicon.ico", source: "Yonex 官网" },
  Prince: { slug: "prince", websiteUrl: "https://princetennis.com/racquets", logoUrl: "https://princetennis.com/favicon.ico", source: "Prince 官网" },
  Tecnifibre: { slug: "tecnifibre", websiteUrl: "https://www.tecnifibre.com/en/tennis/tennis-rackets/", logoUrl: "https://www.tecnifibre.com/favicon.ico", source: "Tecnifibre 官网" },
  Dunlop: { slug: "dunlop", websiteUrl: "https://dunlopsports.com/products/tennis/rackets", logoUrl: "https://dunlopsports.com/favicon.ico", source: "Dunlop 官网" }
};

const rackets = [
  ["Wilson", "Blade 98 18x20 v9", "Blade", 259, 1899, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 322, balanceMm: 320, stringPattern: "18x20", stiffnessRa: 62 }],
  ["Wilson", "Blade 100L v9", "Blade", 239, 1699, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 285, swingWeight: 312, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 61 }],
  ["Wilson", "Blade 104 v9", "Blade", 249, 1799, { headSizeSqIn: 104, lengthIn: 27.5, unstrungWeightG: 290, swingWeight: 318, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 60 }],
  ["Wilson", "Clash 100 Pro v2", "Clash", 269, 1999, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 310, swingWeight: 326, balanceMm: 315, stringPattern: "16x20", stiffnessRa: 55 }],
  ["Wilson", "Clash 100L v2", "Clash", 239, 1699, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 280, swingWeight: 309, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 55 }],
  ["Wilson", "Ultra 100L v4", "Ultra", 239, 1699, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 280, swingWeight: 312, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 69 }],
  ["Wilson", "Shift 99 v1", "Shift", 259, 1899, { headSizeSqIn: 99, lengthIn: 27, unstrungWeightG: 300, swingWeight: 320, balanceMm: 320, stringPattern: "16x20", stiffnessRa: 68 }],
  ["Wilson", "Pro Staff X v14", "Pro Staff", 279, 2099, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 315, swingWeight: 322, balanceMm: 310, stringPattern: "16x19", stiffnessRa: 66 }],

  ["Babolat", "Pure Aero Team Gen9", "Pure Aero", 279, 1799, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 285, swingWeight: 280, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 70 }],
  ["Babolat", "Pure Aero Lite Gen9", "Pure Aero", 269, 1699, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 270, swingWeight: 270, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 70 }],
  ["Babolat", "Pure Drive 98", "Pure Drive", 279, 2099, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 325, balanceMm: 320, stringPattern: "16x20", stiffnessRa: 70 }],
  ["Babolat", "Pure Drive Team", "Pure Drive", 269, 1799, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 285, swingWeight: 312, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 72 }],
  ["Babolat", "Pure Drive 107", "Pure Drive", 259, 1699, { headSizeSqIn: 107, lengthIn: 27.2, unstrungWeightG: 285, swingWeight: 315, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 72 }],
  ["Babolat", "Pure Strike 97", "Pure Strike", 279, 2199, { headSizeSqIn: 97, lengthIn: 27, unstrungWeightG: 310, swingWeight: 326, balanceMm: 315, stringPattern: "16x20", stiffnessRa: 67 }],
  ["Babolat", "Pure Strike 98 18x20", "Pure Strike", 269, 1999, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 326, balanceMm: 320, stringPattern: "18x20", stiffnessRa: 67 }],

  ["HEAD", "Speed Pro 2024", "Speed", 269, 2099, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 310, swingWeight: 330, balanceMm: 315, stringPattern: "18x20", stiffnessRa: 60 }],
  ["HEAD", "Speed Team 2024", "Speed", 249, 1699, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 285, swingWeight: 312, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 62 }],
  ["HEAD", "Radical Pro 2023", "Radical", 269, 1999, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 315, swingWeight: 330, balanceMm: 315, stringPattern: "16x19", stiffnessRa: 65 }],
  ["HEAD", "Radical Team 2023", "Radical", 239, 1599, { headSizeSqIn: 102, lengthIn: 27, unstrungWeightG: 280, swingWeight: 310, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 64 }],
  ["HEAD", "Gravity Pro 2023", "Gravity", 269, 2099, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 315, swingWeight: 332, balanceMm: 315, stringPattern: "18x20", stiffnessRa: 59 }],
  ["HEAD", "Gravity Team 2023", "Gravity", 239, 1599, { headSizeSqIn: 104, lengthIn: 27, unstrungWeightG: 285, swingWeight: 310, balanceMm: 330, stringPattern: "16x20", stiffnessRa: 59 }],
  ["HEAD", "Extreme Team 2024", "Extreme", 239, 1599, { headSizeSqIn: 105, lengthIn: 27, unstrungWeightG: 275, swingWeight: 305, balanceMm: 340, stringPattern: "16x19", stiffnessRa: 65 }],
  ["HEAD", "Prestige MP 2023", "Prestige", 269, 1999, { headSizeSqIn: 99, lengthIn: 27, unstrungWeightG: 310, swingWeight: 326, balanceMm: 320, stringPattern: "18x19", stiffnessRa: 61 }],

  ["Yonex", "EZONE 98 Tour", "EZONE", 279, 2199, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 315, swingWeight: 330, balanceMm: 315, stringPattern: "16x19", stiffnessRa: 65 }],
  ["Yonex", "EZONE 98L", "EZONE", 249, 1799, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 285, swingWeight: 310, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 64 }],
  ["Yonex", "EZONE 100L", "EZONE", 249, 1799, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 285, swingWeight: 312, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 67 }],
  ["Yonex", "EZONE 105", "EZONE", 249, 1699, { headSizeSqIn: 105, lengthIn: 27, unstrungWeightG: 275, swingWeight: 308, balanceMm: 335, stringPattern: "16x19", stiffnessRa: 68 }],
  ["Yonex", "VCORE 98 Tour", "VCORE", 279, 2199, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 315, swingWeight: 328, balanceMm: 315, stringPattern: "16x19", stiffnessRa: 63 }],
  ["Yonex", "VCORE 100L", "VCORE", 249, 1799, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 280, swingWeight: 310, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 66 }],
  ["Yonex", "Percept 97D", "Percept", 279, 2199, { headSizeSqIn: 97, lengthIn: 27, unstrungWeightG: 320, swingWeight: 332, balanceMm: 310, stringPattern: "18x20", stiffnessRa: 60 }],
  ["Yonex", "Percept 100", "Percept", 269, 1999, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 322, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 62 }],

  ["Prince", "Phantom 97P", "Phantom", 249, 1699, { headSizeSqIn: 97, lengthIn: 27, unstrungWeightG: 320, swingWeight: 326, balanceMm: 310, stringPattern: "16x18", stiffnessRa: 59 }],
  ["Prince", "Phantom 100X 290", "Phantom", 239, 1499, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 290, swingWeight: 312, balanceMm: 325, stringPattern: "16x18", stiffnessRa: 59 }],
  ["Prince", "Tour 98", "Tour", 249, 1699, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 323, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 62 }],
  ["Prince", "Tour 100 290", "Tour", 239, 1499, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 290, swingWeight: 315, balanceMm: 325, stringPattern: "16x18", stiffnessRa: 62 }],
  ["Prince", "Warrior 107", "Warrior", 199, 1299, { headSizeSqIn: 107, lengthIn: 27.2, unstrungWeightG: 285, swingWeight: 312, balanceMm: 335, stringPattern: "16x19", stiffnessRa: 66 }],
  ["Prince", "Beast 98", "Beast", 229, 1499, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 322, balanceMm: 320, stringPattern: "16x20", stiffnessRa: 67 }],

  ["Tecnifibre", "T-FIGHT 300S", "TFIGHT", 259, 1899, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 300, swingWeight: 324, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 66 }],
  ["Tecnifibre", "T-FIGHT 285", "TFIGHT", 229, 1599, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 285, swingWeight: 312, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 66 }],
  ["Tecnifibre", "T-FIGHT 270", "TFIGHT", 209, 1399, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 270, swingWeight: 305, balanceMm: 335, stringPattern: "16x19", stiffnessRa: 66 }],
  ["Tecnifibre", "TF40 305 18M", "TF40", 259, 1899, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 326, balanceMm: 320, stringPattern: "18x20", stiffnessRa: 64 }],
  ["Tecnifibre", "TF40 290 16M", "TF40", 249, 1699, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 290, swingWeight: 315, balanceMm: 325, stringPattern: "16x19", stiffnessRa: 64 }],
  ["Tecnifibre", "TF-X1 285", "TF-X1", 229, 1599, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 285, swingWeight: 312, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 70 }],
  ["Tecnifibre", "Tempo 298", "Tempo", 249, 1699, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 298, swingWeight: 318, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 66 }],

  ["Dunlop", "CX 200", "CX", 229, 1499, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 322, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 62 }],
  ["Dunlop", "CX 200 LS", "CX", 209, 1399, { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 290, swingWeight: 312, balanceMm: 325, stringPattern: "16x19", stiffnessRa: 63 }],
  ["Dunlop", "CX 400", "CX", 219, 1399, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 285, swingWeight: 312, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 67 }],
  ["Dunlop", "FX 500 LS", "FX", 209, 1399, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 285, swingWeight: 312, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 69 }],
  ["Dunlop", "SX 300 LS", "SX", 209, 1399, { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 285, swingWeight: 312, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 68 }],
  ["Dunlop", "LX 800", "LX", 209, 1299, { headSizeSqIn: 110, lengthIn: 27.25, unstrungWeightG: 255, swingWeight: 305, balanceMm: 350, stringPattern: "16x18", stiffnessRa: 70 }]
];

function normalize(name) {
  return name.toLowerCase().replace(/[™®]/g, "").replace(/\b(v\d+|gen\s*\d+|202\d)\b/g, "").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function slugify(input) {
  return input.toLowerCase().replace(/[™®]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function year(name) {
  const match = name.match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function generation(name) {
  return name.match(/\b(v\d+|gen\d+|gen\s*\d+)\b/i)?.[1]?.replace(/\s+/g, "") ?? null;
}

function traits(name, series, spec) {
  const text = `${series} ${name}`.toLowerCase();
  const set = new Set();
  if (/aero|spin|vcore|extreme|sx|beast|ripstick/.test(text) || spec.stringPattern === "16x19" || spec.stringPattern === "16x18") set.add("旋转");
  if (/drive|ultra|boom|power|ezone|beast|fx|ripstick/.test(text) || spec.stiffnessRa >= 68) set.add("力量");
  if (/blade|strike|speed|gravity|percept|phantom|tfight|tf40|cx|tour|prestige|control/.test(text)) set.add("控制");
  if (/clash|phantom|comfort|gravity|percept/.test(text) || spec.stiffnessRa <= 62) set.add("舒适");
  if (/lite|team|feel|105|107|110|ls|l\b/.test(text) || spec.unstrungWeightG <= 285) set.add("轻量");
  if (/team|mp|100|104|105|107|110|lite|ls/.test(text)) set.add("进阶");
  if (/pro|tour|97|98|95|rf|prestige|tfight|tf40/.test(text) || spec.unstrungWeightG >= 305) set.add("竞技");
  if (/pro staff|prestige|percept|phantom|cx|strike|tf40/.test(text)) set.add("手感");
  return Array.from(set);
}

function imageUrl(brand, name) {
  const colors = {
    Wilson: ["#1e7f54", "#7bdc8a"],
    Babolat: ["#253a80", "#f0d43a"],
    HEAD: ["#ec5b2f", "#1f5ca8"],
    Yonex: ["#2448a5", "#79d5e7"],
    Prince: ["#284836", "#85c56a"],
    Tecnifibre: ["#d73731", "#111827"],
    Dunlop: ["#2f6bca", "#d7f04a"]
  };
  const [frame, accent] = colors[brand] ?? colors.Wilson;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675"><defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#17201a" flood-opacity=".16"/></filter></defs><g transform="translate(224 78) rotate(-22 250 250)" filter="url(#s)"><ellipse cx="280" cy="178" rx="132" ry="184" fill="none" stroke="${frame}" stroke-width="28"/><ellipse cx="280" cy="178" rx="96" ry="146" fill="none" stroke="${accent}" stroke-width="8" opacity=".9"/><line x1="208" y1="46" x2="208" y2="310" stroke="#17201a" stroke-width="2" opacity=".25"/><line x1="232" y1="46" x2="232" y2="310" stroke="#17201a" stroke-width="2" opacity=".25"/><line x1="256" y1="46" x2="256" y2="310" stroke="#17201a" stroke-width="2" opacity=".25"/><line x1="280" y1="46" x2="280" y2="310" stroke="#17201a" stroke-width="2" opacity=".25"/><line x1="304" y1="46" x2="304" y2="310" stroke="#17201a" stroke-width="2" opacity=".25"/><line x1="328" y1="46" x2="328" y2="310" stroke="#17201a" stroke-width="2" opacity=".25"/><line x1="352" y1="46" x2="352" y2="310" stroke="#17201a" stroke-width="2" opacity=".25"/><path d="M246 354 L220 542 Q218 570 245 577 L296 589 Q323 595 331 568 L356 374" fill="${frame}"/><path d="M237 454 L335 478" stroke="${accent}" stroke-width="11" stroke-linecap="round"/><path d="M230 500 L323 523" stroke="${accent}" stroke-width="11" stroke-linecap="round"/></g><text x="62" y="88" font-family="Arial" font-size="38" font-weight="800" fill="#17201a">${brand}</text><text x="62" y="132" font-family="Arial" font-size="24" font-weight="700" fill="${frame}">${name}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function audience(name, spec) {
  if (spec.unstrungWeightG <= 285 || spec.headSizeSqIn >= 104) return "需要轻松挥拍、容错和舒适上手的球员";
  if (spec.headSizeSqIn <= 98 && spec.unstrungWeightG >= 305) return "追求控制、稳定和清晰击球反馈的高阶球员";
  if (spec.stringPattern === "16x19" || spec.stringPattern === "16x18") return "希望兼顾上旋、深度和进攻效率的底线球员";
  return "需要均衡性能和稳定容错的进阶球员";
}

function description(name, series, spec) {
  return `${name} 是 ${series} 系列的一个补充版本，采用 ${spec.headSizeSqIn} 平方英寸拍面、${spec.unstrungWeightG}g 未穿线重量和 ${spec.stringPattern} 线床，适合在同系列中按重量、拍面和控制/力量取向进行比较。`;
}

async function main() {
  let imported = 0;

  for (const [brandName, name, series, usd, cny, spec] of rackets) {
    const meta = brands[brandName];
    const brand = await prisma.brand.upsert({
      where: { slug: meta.slug },
      update: { name: brandName, websiteUrl: meta.websiteUrl, logoUrl: meta.logoUrl },
      create: { name: brandName, slug: meta.slug, websiteUrl: meta.websiteUrl, logoUrl: meta.logoUrl }
    });
    const sourceUrl = `${meta.websiteUrl}?q=${encodeURIComponent(name)}`;
    const racket = await prisma.racket.upsert({
      where: { brandId_normalizedName_series: { brandId: brand.id, normalizedName: normalize(name), series } },
      update: {
        name,
        slug: slugify(`${meta.slug}-${name}`),
        modelYear: year(name),
        generation: generation(name),
        colorway: null,
        variantLabel: name,
        imageUrl: imageUrl(brandName, name),
        imageSourceUrl: sourceUrl,
        sourceUrl,
        traits: JSON.stringify(traits(name, series, spec)),
        audience: audience(name, spec),
        description: description(name, series, spec)
      },
      create: {
        brandId: brand.id,
        name,
        normalizedName: normalize(name),
        slug: slugify(`${meta.slug}-${name}`),
        series,
        modelYear: year(name),
        generation: generation(name),
        colorway: null,
        variantLabel: name,
        imageUrl: imageUrl(brandName, name),
        imageSourceUrl: sourceUrl,
        sourceUrl,
        traits: JSON.stringify(traits(name, series, spec)),
        audience: audience(name, spec),
        description: description(name, series, spec)
      }
    });

    await prisma.racketSpec.upsert({ where: { racketId: racket.id }, update: spec, create: { racketId: racket.id, ...spec } });

    const official = await prisma.source.upsert({
      where: { name: meta.source },
      update: { region: "US", url: meta.websiteUrl, confidence: 85, ruleKey: `${meta.slug}-official` },
      create: { name: meta.source, region: "US", url: meta.websiteUrl, confidence: 85, ruleKey: `${meta.slug}-official` }
    });
    await prisma.price.upsert({
      where: { racketId_sourceId_currency_region: { racketId: racket.id, sourceId: official.id, currency: "USD", region: "US" } },
      update: { amount: usd, productUrl: sourceUrl, fetchedAt },
      create: { racketId: racket.id, sourceId: official.id, currency: "USD", region: "US", amount: usd, productUrl: sourceUrl, fetchedAt }
    });

    const cnName = brandName === "HEAD" ? "动库商城" : "优个网";
    const cnUrl = brandName === "HEAD" ? "https://www.dku51.com/" : "https://www.yoger.com.cn/";
    const cnSource = await prisma.source.upsert({
      where: { name: cnName },
      update: { region: "CN", url: cnUrl, confidence: 70, ruleKey: brandName === "HEAD" ? "dku-cn-price-list" : "yoger-cn-list" },
      create: { name: cnName, region: "CN", url: cnUrl, confidence: 70, ruleKey: brandName === "HEAD" ? "dku-cn-price-list" : "yoger-cn-list" }
    });
    await prisma.price.upsert({
      where: { racketId_sourceId_currency_region: { racketId: racket.id, sourceId: cnSource.id, currency: "CNY", region: "CN" } },
      update: { amount: cny, productUrl: cnUrl, fetchedAt },
      create: { racketId: racket.id, sourceId: cnSource.id, currency: "CNY", region: "CN", amount: cny, productUrl: cnUrl, fetchedAt }
    });
    imported++;
  }

  await prisma.syncRun.create({ data: { sourceName: "expanded-catalog-2026-05", status: "success", finishedAt: new Date(), imported } });
  const total = await prisma.racket.count();
  const series = await prisma.racket.groupBy({ by: ["brandId", "series"], _count: { _all: true } });
  console.log(`Imported ${imported} entries. Total variants: ${total}. Series: ${series.length}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
