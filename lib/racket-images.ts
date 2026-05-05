import { slugify } from "@/lib/racket-utils";

const tennisWarehouseCodes: Record<string, string> = {
  "Wilson Blade 98 16x19 v9": "WB9816",
  "Wilson Blade 98 18x20 v9": "WB98V9",
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
  const yOffset = (hashCode(id) % 16) - 8;
  const accentOffset = (hashCode(`${id}-accent`) % 18) - 9;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675" role="img" aria-label="${escapeXml(`${brand} ${name}`)}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#17201a" flood-opacity=".16"/>
    </filter>
    <linearGradient id="paint" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.frame}"/>
      <stop offset="1" stop-color="${palette.accent}"/>
    </linearGradient>
  </defs>
  ${racketShape(270, 80 + yOffset, -13, palette.frame, palette.accent, "0.96")}
  ${racketShape(500, 72 - yOffset, 13, palette.frame, palette.accent, "1")}
  <text x="74" y="96" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="#17201a">${escapeXml(brand)}</text>
  <text x="74" y="132" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="${palette.frame}">${escapeXml(shortName.slice(0, 36))}</text>
  <path d="M632 ${150 + accentOffset} h72" stroke="${palette.accent}" stroke-width="10" stroke-linecap="round" opacity=".8"/>
  <path d="M644 ${178 + accentOffset} h58" stroke="${palette.frame}" stroke-width="8" stroke-linecap="round" opacity=".75"/>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function racketShape(x: number, y: number, rotate: number, frame: string, accent: string, opacity: string) {
  return `
  <g transform="translate(${x} ${y}) rotate(${rotate} 120 250)" filter="url(#shadow)" opacity="${opacity}">
    <ellipse cx="120" cy="154" rx="88" ry="140" fill="none" stroke="${frame}" stroke-width="18"/>
    <ellipse cx="120" cy="154" rx="67" ry="112" fill="none" stroke="${accent}" stroke-width="6" opacity=".9"/>
    ${stringLines(120, 154)}
    <path d="M98 286 L78 470 Q76 492 96 498 L132 508 Q154 514 160 490 L182 300" fill="${frame}"/>
    <path d="M91 386 L166 405" stroke="${accent}" stroke-width="9" stroke-linecap="round"/>
    <path d="M86 426 L155 443" stroke="${accent}" stroke-width="9" stroke-linecap="round"/>
    <path d="M78 470 Q76 492 96 498 L132 508 Q154 514 160 490 L164 458 L84 438 Z" fill="#20251f" opacity=".9"/>
  </g>`;
}

function stringLines(cx: number, cy: number) {
  const vertical = [-48, -32, -16, 0, 16, 32, 48]
    .map((offset) => `<line x1="${cx + offset}" y1="${cy - 96}" x2="${cx + offset}" y2="${cy + 96}" stroke="#17201a" stroke-width="1.5" opacity=".28"/>`)
    .join("");
  const horizontal = [-72, -48, -24, 0, 24, 48, 72]
    .map((offset) => `<line x1="${cx - 58}" y1="${cy + offset}" x2="${cx + 58}" y2="${cy + offset}" stroke="#17201a" stroke-width="1.5" opacity=".24"/>`)
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
