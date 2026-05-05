import { slugify } from "@/lib/racket-utils";

const tennisWarehouseCodes: Record<string, string> = {
  "Wilson Blade 98 16x19 v9": "WB9816",
  "Wilson Blade 100 v9": "WB1009",
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

const paletteByBrand: Record<string, { frame: string; accent: string; bg: string }> = {
  Wilson: { frame: "#1e7f54", accent: "#7bdc8a", bg: "#e8f3ec" },
  Babolat: { frame: "#253a80", accent: "#f0d43a", bg: "#eef2ff" },
  HEAD: { frame: "#ec5b2f", accent: "#1f5ca8", bg: "#fff0e8" },
  Yonex: { frame: "#2448a5", accent: "#79d5e7", bg: "#edf6ff" },
  Prince: { frame: "#284836", accent: "#85c56a", bg: "#edf6eb" },
  Tecnifibre: { frame: "#d73731", accent: "#111827", bg: "#fff1f1" },
  Dunlop: { frame: "#2f6bca", accent: "#d7f04a", bg: "#eef5ff" }
};

export function racketProductImageUrl(brand: string, name: string) {
  const code = tennisWarehouseCodes[`${brand} ${name}`] ?? tennisWarehouseCodes[name];
  if (!code) return generatedRacketImage(brand, name);
  return `https://img.tennis-warehouse.com/watermark/rs.php?path=${code}-1.jpg&nw=900`;
}

export function racketImageSourceUrl(brandWebsiteUrl: string, brand: string, name: string) {
  const code = tennisWarehouseCodes[`${brand} ${name}`] ?? tennisWarehouseCodes[name];
  if (!code) return brandWebsiteUrl;
  return `https://www.tennis-warehouse.com/descpage.html?pcode=${code}`;
}

export function generatedRacketImage(brand: string, name: string) {
  const palette = paletteByBrand[brand] ?? { frame: "#2f7d57", accent: "#c85d38", bg: "#f3f5f1" };
  const shortName = name.replace(/\s+/g, " ");
  const id = slugify(`${brand}-${name}`);
  const yOffset = (hashCode(id) % 18) - 9;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675" role="img" aria-label="${escapeXml(`${brand} ${name}`)}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#17201a" flood-opacity=".16"/>
    </filter>
  </defs>
  <g transform="translate(224 ${76 + yOffset}) rotate(-22 250 250)" filter="url(#shadow)">
    <ellipse cx="280" cy="178" rx="132" ry="184" fill="none" stroke="${palette.frame}" stroke-width="28"/>
    <ellipse cx="280" cy="178" rx="96" ry="146" fill="none" stroke="${palette.accent}" stroke-width="8" opacity=".9"/>
    ${stringLines(280, 178)}
    <path d="M246 354 L220 542 Q218 570 245 577 L296 589 Q323 595 331 568 L356 374" fill="${palette.frame}"/>
    <path d="M237 454 L335 478" stroke="${palette.accent}" stroke-width="11" stroke-linecap="round"/>
    <path d="M230 500 L323 523" stroke="${palette.accent}" stroke-width="11" stroke-linecap="round"/>
  </g>
  <g>
    <text x="62" y="88" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800" fill="#17201a">${escapeXml(brand)}</text>
    <text x="62" y="132" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="${palette.frame}">${escapeXml(shortName)}</text>
  </g>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function stringLines(cx: number, cy: number) {
  const vertical = [-72, -48, -24, 0, 24, 48, 72]
    .map((offset) => `<line x1="${cx + offset}" y1="${cy - 132}" x2="${cx + offset}" y2="${cy + 132}" stroke="#17201a" stroke-width="2" opacity=".28"/>`)
    .join("");
  const horizontal = [-102, -68, -34, 0, 34, 68, 102]
    .map((offset) => `<line x1="${cx - 86}" y1="${cy + offset}" x2="${cx + 86}" y2="${cy + offset}" stroke="#17201a" stroke-width="2" opacity=".24"/>`)
    .join("");
  return vertical + horizontal;
}

function hashCode(input: string) {
  return Array.from(input).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0);
}

function escapeXml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
