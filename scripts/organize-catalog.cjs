const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const seriesMeta = {
  "Wilson Blade": { generation: null, modelYear: null, colorway: null },
  "Wilson Clash": { generation: "v2", modelYear: 2022, colorway: "Infrared / Black" },
  "Wilson Pro Staff": { generation: "v14", modelYear: 2023, colorway: "Copper / Black" },
  "Wilson RF": { generation: "RF 01", modelYear: 2024, colorway: "Black" },
  "Wilson Shift": { generation: "v1", modelYear: 2023, colorway: "Arctic Prism" },
  "Wilson Ultra": { generation: "v4", modelYear: 2022, colorway: "Electric Indigo" },

  "Babolat Pure Aero": { generation: "2023", modelYear: 2023, colorway: "Yellow / Black" },
  "Babolat Pure Drive": { generation: "2025", modelYear: 2025, colorway: "Blue" },
  "Babolat Pure Strike": { generation: "Gen4", modelYear: 2024, colorway: "White / Strike Red" },

  "HEAD Boom": { generation: "2024", modelYear: 2024, colorway: "Mint / Black" },
  "HEAD Extreme": { generation: "2024", modelYear: 2024, colorway: "Auxetic 2.0 Yellow" },
  "HEAD Gravity": { generation: "2023", modelYear: 2023, colorway: "Black / Flip" },
  "HEAD Prestige": { generation: "2023", modelYear: 2023, colorway: "Burgundy" },
  "HEAD Radical": { generation: "2023", modelYear: 2023, colorway: "Orange / Navy" },
  "HEAD Speed": { generation: "2024", modelYear: 2024, colorway: "White / Black" },

  "Yonex EZONE": { generation: "2025", modelYear: 2025, colorway: "Blast Blue" },
  "Yonex Percept": { generation: "2023", modelYear: 2023, colorway: "Olive Green" },
  "Yonex VCORE": { generation: "2023", modelYear: 2023, colorway: "Scarlet" },

  "Prince Beast": { generation: "Current", modelYear: 2024, colorway: "Red / Black" },
  "Prince Phantom": { generation: "Current", modelYear: 2024, colorway: "Black / Green" },
  "Prince Ripstick": { generation: "Current", modelYear: 2023, colorway: "Black / Lime" },
  "Prince Tour": { generation: "Current", modelYear: 2024, colorway: "White / Green" },
  "Prince Warrior": { generation: "Current", modelYear: 2023, colorway: "Black / Red" },

  "Tecnifibre Tempo": { generation: "2024", modelYear: 2024, colorway: "White / Red" },
  "Tecnifibre TF-X1": { generation: "v2", modelYear: 2024, colorway: "White / Blue" },
  "Tecnifibre TF40": { generation: "2024", modelYear: 2024, colorway: "White / Red" },
  "Tecnifibre TFIGHT": { generation: "2025", modelYear: 2025, colorway: "White / Black" },

  "Dunlop CX": { generation: "2024", modelYear: 2024, colorway: "Red / Black" },
  "Dunlop FX": { generation: "2023", modelYear: 2023, colorway: "Blue / Black" },
  "Dunlop LX": { generation: "2022", modelYear: 2022, colorway: "Blue / White" },
  "Dunlop SX": { generation: "2022", modelYear: 2022, colorway: "Yellow / Black" }
};

function generationFromName(name) {
  return name.match(/\b(v\d+|gen\s*\d+|20\d{2})\b/i)?.[1]?.replace(/\s+/g, "") ?? null;
}

function yearFromName(name) {
  const match = name.match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function variantLabel(name, series) {
  return name
    .replace(new RegExp(`^${escapeRegExp(series)}\\s*`, "i"), "")
    .replace(/\b(v\d+|gen\s*\d+|20\d{2})\b/gi, "")
    .replace(/\s+/g, " ")
    .trim() || name;
}

function escapeRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function main() {
  const rackets = await prisma.racket.findMany({ include: { brand: true } });
  let updated = 0;

  for (const racket of rackets) {
    const key = `${racket.brand.name} ${racket.series}`;
    const meta = seriesMeta[key] ?? {};
    const nameGeneration = generationFromName(racket.name);
    const generation = racket.generation ?? nameGeneration ?? meta.generation ?? null;
    const modelYear = racket.modelYear ?? yearFromName(racket.name) ?? meta.modelYear ?? null;
    const colorway = racket.colorway ?? meta.colorway ?? null;
    const label = racket.variantLabel && racket.variantLabel !== racket.name ? racket.variantLabel : variantLabel(racket.name, racket.series);

    await prisma.racket.update({
      where: { id: racket.id },
      data: {
        generation,
        modelYear,
        colorway,
        variantLabel: label
      }
    });
    updated++;
  }

  await prisma.syncRun.create({
    data: {
      sourceName: "catalog-organization",
      status: "success",
      finishedAt: new Date(),
      imported: updated
    }
  });
  console.log(`Organized ${updated} rackets.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
