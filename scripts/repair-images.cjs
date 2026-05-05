const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const tennisWarehouseCodes = {
  "Wilson Blade 98 16x19 v9": "WB9816",
  "Wilson Blade 100 v9": "WB1009",
  "Wilson Blade 98 16x19 v10": "WB9810",
  "Wilson Blade 98 18x20 v10": "WB9818",
  "Wilson Blade 98S v10": "WB98S1",
  "Wilson Blade 100 v10": "WB1001",
  "Wilson Blade 100L v10": "WB10L1",
  "Wilson Blade 104 v10": "WB104V",
  "Wilson Blade 100 Pro v10": "WB100P",
  "Wilson Pro Staff 97 v14": "W97V14",
  "Wilson Clash 100 v2": "WC100V",
  "Wilson Ultra 100 v4": "WU100V4",
  "Wilson Shift 99 Pro v1": "WSP315",
  "Wilson RF 01 Pro": "WRFPR",
  "Babolat Pure Drive 100": "BPD25R",
  "Babolat Pure Aero 100": "BARO",
  "Babolat Pure Aero 98": "BARO98",
  "Babolat Pure Strike 98 16x19": "PSRKT",
  "Babolat Pure Strike 100": "PS1020",
  "Babolat Pure Aero Rafa Origin": "BPARO",
  "Babolat Pure Drive Lite": "BPDLR",
  "HEAD Speed MP 2024": "HSPDM",
  "HEAD Radical MP 2023": "HMPR",
  "HEAD Gravity MP 2023": "HGMP",
  "HEAD Extreme MP 2024": "HREM24",
  "HEAD Prestige Pro 2023": "HPP",
  "HEAD Boom MP 2024": "HBOOMM",
  "HEAD Boom Pro 2024": "HBOOMP",
  "Yonex EZONE 100": "EZ10BB",
  "Yonex EZONE 98": "EZ98BB",
  "Yonex VCORE 100": "VC10SB",
  "Yonex VCORE 98": "VC98S",
  "Yonex VCORE 95": "YVC95",
  "Yonex Percept 97": "PER97",
  "Yonex Percept 100D": "PERC1D",
  "Prince Phantom 100X 305": "PHNX5",
  "Prince Phantom 100P": "PHNP1",
  "Prince Tour 100P": "PTOURP",
  "Prince Beast 100": "PBEAST",
  "Prince Warrior 100": "P5WA30",
  "Prince Ripstick 100": "25RIPH",
  "Tecnifibre TFIGHT 305 ISOFLEX": "ISO305",
  "Tecnifibre TFIGHT 300 ISOFLEX": "TFI300",
  "Tecnifibre TFIGHT 315 ISOFLEX": "ISO315",
  "Tecnifibre TF40 305 16M": "TF4ON",
  "Tecnifibre TF40 315 18M": "TF40R8",
  "Tecnifibre TF-X1 300": "TFX130",
  "Dunlop CX 200 Tour 18x20": "DCX2T8",
  "Dunlop CX 400 Tour": "DCX400T",
  "Dunlop FX 500": "DF500",
  "Dunlop FX 500 Tour": "DF50T",
  "Dunlop SX 300": "DSX300",
  "Dunlop SX 300 Tour": "DSXTR",
  "Dunlop LX 1000": "DLX1000"
};

function imageUrl(code) {
  return `https://img.tennis-warehouse.com/watermark/rs.php?path=${code}-1.jpg&nw=900`;
}

function sourceUrl(code) {
  return `https://www.tennis-warehouse.com/descpage.html?pcode=${code}`;
}

async function main() {
  let repaired = 0;
  for (const [key, code] of Object.entries(tennisWarehouseCodes)) {
    const { brandName, racketName } = splitKey(key);
    const result = await prisma.racket.updateMany({
      where: {
        name: racketName,
        brand: { name: brandName }
      },
      data: {
        imageUrl: imageUrl(code),
        imageSourceUrl: sourceUrl(code)
      }
    });
    repaired += result.count;
  }

  await prisma.syncRun.create({
    data: {
      sourceName: "image-repair",
      status: "success",
      finishedAt: new Date(),
      imported: repaired
    }
  });
  console.log(`Repaired ${repaired} racket images.`);
}

function splitKey(key) {
  const brandNames = ["Tecnifibre", "Babolat", "Wilson", "Prince", "Dunlop", "Yonex", "HEAD"];
  const brandName = brandNames.find((brand) => key.startsWith(`${brand} `));
  if (!brandName) throw new Error(`Unknown brand key: ${key}`);
  return {
    brandName,
    racketName: key.slice(brandName.length + 1)
  };
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
