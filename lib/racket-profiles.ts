import { TRAITS, type RacketListItem, type Trait } from "@/lib/types";
import { specClass } from "@/lib/spec-classification";

export type Player = {
  name: string;
  country: string;
  note: string;
  wikiTitle?: string;
};

const seriesPlayers: Record<string, Player[]> = {
  "Wilson Blade": [
    { name: "Aryna Sabalenka", country: "白俄罗斯", note: "Blade 系列代表球员" },
    { name: "Stefanos Tsitsipas", country: "希腊", note: "长期使用 Blade 系列涂装/定制版本" }
  ],
  "Wilson Pro Staff": [
    { name: "Roger Federer", country: "瑞士", note: "Pro Staff 系列标志性球员" },
    { name: "Grigor Dimitrov", country: "保加利亚", note: "使用过 Pro Staff 系列职业版本" }
  ],
  "Wilson Clash": [
    { name: "Nicole Gibbs", country: "美国", note: "曾使用 Clash 系列推广版本" },
    { name: "Robin Haase", country: "荷兰", note: "使用过 Clash 系列涂装" }
  ],
  "Wilson Ultra": [
    { name: "Gael Monfils", country: "法国", note: "使用过 Ultra 系列涂装" },
    { name: "Victoria Azarenka", country: "白俄罗斯", note: "曾使用 Wilson 力量型系列" }
  ],
  "Wilson Shift": [
    { name: "Marta Kostyuk", country: "乌克兰", note: "Shift 系列推广球员" },
    { name: "Sebastian Korda", country: "美国", note: "使用过 Wilson 现代旋转取向涂装" }
  ],
  "Wilson RF": [
    { name: "Roger Federer", country: "瑞士", note: "RF 系列共同设计者" },
    { name: "Ben Shelton", country: "美国", note: "使用 Wilson 竞技框体" }
  ],
  "Babolat Pure Drive": [
    { name: "Kim Clijsters", country: "比利时", note: "Pure Drive 经典使用者" },
    { name: "Garbine Muguruza", country: "西班牙", note: "使用过 Pure Drive 系列" }
  ],
  "Babolat Pure Aero": [
    { name: "Rafael Nadal", country: "西班牙", note: "Pure Aero/Rafa 系列标志性球员" },
    { name: "Carlos Alcaraz", country: "西班牙", note: "使用 Pure Aero 98 职业版本" }
  ],
  "Babolat Pure Strike": [
    { name: "Dominic Thiem", country: "奥地利", note: "Pure Strike 系列代表球员" },
    { name: "Cameron Norrie", country: "英国", note: "使用 Pure Strike 系列" }
  ],
  "HEAD Speed": [
    { name: "Novak Djokovic", country: "塞尔维亚", note: "Speed 系列标志性球员" },
    { name: "Jannik Sinner", country: "意大利", note: "使用 Speed 系列职业版本" }
  ],
  "HEAD Radical": [
    { name: "Taylor Fritz", country: "美国", note: "Radical 系列代表球员" },
    { name: "Diego Schwartzman", country: "阿根廷", note: "使用过 Radical 系列" }
  ],
  "HEAD Gravity": [
    { name: "Alexander Zverev", country: "德国", note: "Gravity 系列代表球员" },
    { name: "Andrey Rublev", country: "俄罗斯", note: "使用 Gravity 系列职业版本" }
  ],
  "HEAD Extreme": [
    { name: "Matteo Berrettini", country: "意大利", note: "Extreme 系列代表球员" },
    { name: "Richard Gasquet", country: "法国", note: "使用过 Extreme 系列涂装" }
  ],
  "HEAD Prestige": [
    { name: "Marin Cilic", country: "克罗地亚", note: "Prestige 系列代表球员" },
    { name: "Aslan Karatsev", country: "俄罗斯", note: "使用过 Prestige 系列职业版本" }
  ],
  "HEAD Boom": [
    { name: "Coco Gauff", country: "美国", note: "Boom 系列代表球员" },
    { name: "Lorenzo Musetti", country: "意大利", note: "使用 HEAD 进攻型框体" }
  ],
  "Yonex EZONE": [
    { name: "Naomi Osaka", country: "日本", note: "EZONE 系列代表球员" },
    { name: "Ben Shelton", country: "美国", note: "使用 EZONE 系列职业版本" }
  ],
  "Yonex VCORE": [
    { name: "Elena Rybakina", country: "哈萨克斯坦", note: "VCORE 系列代表球员" },
    { name: "Denis Shapovalov", country: "加拿大", note: "使用 VCORE 系列" }
  ],
  "Yonex Percept": [
    { name: "Stan Wawrinka", country: "瑞士", note: "Percept/VCORE Pro 系列代表球员" },
    { name: "Hubert Hurkacz", country: "波兰", note: "使用 Yonex 控制型框体" }
  ],
  "Prince Phantom": [
    { name: "Lucas Pouille", country: "法国", note: "使用过 Prince 控制型框体" },
    { name: "John Isner", country: "美国", note: "长期使用 Prince 职业版本" }
  ],
  "Prince Tour": [
    { name: "John Isner", country: "美国", note: "Prince 职业框体代表球员" },
    { name: "Nicolas Kicker", country: "阿根廷", note: "使用过 Prince Tour 系列" }
  ],
  "Prince Beast": [
    { name: "Lucas Pouille", country: "法国", note: "使用过 Prince 力量型系列" },
    { name: "John Isner", country: "美国", note: "Prince 品牌代表球员" }
  ],
  "Prince Warrior": [
    { name: "John Isner", country: "美国", note: "Prince 品牌代表球员" },
    { name: "Jelena Jankovic", country: "塞尔维亚", note: "使用过 Prince 系列球拍" }
  ],
  "Prince Ripstick": [
    { name: "John Isner", country: "美国", note: "Prince 品牌代表球员" },
    { name: "Patrick Rafter", country: "澳大利亚", note: "Prince 历史代表球员" }
  ],
  "Tecnifibre TFIGHT": [
    { name: "Daniil Medvedev", country: "俄罗斯", note: "TFIGHT 系列代表球员" },
    { name: "Iga Swiatek", country: "波兰", note: "使用 Tecnifibre 职业版本" }
  ],
  "Tecnifibre TF40": [
    { name: "Daniil Medvedev", country: "俄罗斯", note: "Tecnifibre 竞技框体代表球员" },
    { name: "Janko Tipsarevic", country: "塞尔维亚", note: "使用过 Tecnifibre 控制型球拍" }
  ],
  "Tecnifibre TF-X1": [
    { name: "Iga Swiatek", country: "波兰", note: "Tecnifibre 品牌代表球员" },
    { name: "Daniil Medvedev", country: "俄罗斯", note: "Tecnifibre 职业阵容代表" }
  ],
  "Dunlop CX": [
    { name: "Kevin Anderson", country: "南非", note: "CX 系列代表球员" },
    { name: "Jamie Murray", country: "英国", note: "使用 Dunlop 控制型框体" }
  ],
  "Dunlop FX": [
    { name: "Jack Draper", country: "英国", note: "FX 系列代表球员" },
    { name: "Miomir Kecmanovic", country: "塞尔维亚", note: "Dunlop 品牌代表球员" }
  ],
  "Dunlop SX": [
    { name: "Miomir Kecmanovic", country: "塞尔维亚", note: "SX 系列代表球员" },
    { name: "Ann Li", country: "美国", note: "使用 Dunlop 旋转型系列" }
  ],
  "Dunlop LX": [
    { name: "Jamie Murray", country: "英国", note: "Dunlop 品牌代表球员" },
    { name: "Michael Chang", country: "美国", note: "Dunlop 历史代表球员" }
  ]
};

export function racketIntro(racket: RacketListItem) {
  const spec = racket.spec;
  const category = specClass(spec);
  const head = spec?.headSizeSqIn ? `${spec.headSizeSqIn} 平方英寸拍面` : "标准拍面";
  const weight = spec?.unstrungWeightG ? `${spec.unstrungWeightG}g 未穿线重量` : "常规重量";
  const pattern = spec?.stringPattern ? `${spec.stringPattern} 线床` : "常规线床";
  const length = spec?.lengthIn && spec.lengthIn > 27 ? `${spec.lengthIn} 英寸加长拍身` : "标准 27 英寸拍身";
  const traits = cleanTraits(racket.traits).join("、") || category;
  const audience = cleanText(racket.audience);
  const description = cleanText(racket.description);

  return [
    `${racket.name} 属于 ${racket.brand} ${racket.series} 系列，适合${audience || category}。${description || seriesDescription(racket.brand, racket.series, category)}`,
    `从规格看，它采用${head}、${weight}、${pattern}和${length}，因此更接近“${category}”这一类。`,
    `如果你的打法关键词是${traits}，这支拍可以作为选购清单里的重点比较对象；如果你更依赖借力和容错，可以优先关注同系列里更轻或更大拍面的版本。`
  ].map(cleanIntroText);
}

export function racketPlayers(racket: RacketListItem) {
  const key = `${racket.brand} ${racket.series}`;
  return seriesPlayers[key] ?? brandFallbackPlayers[racket.brand] ?? [];
}

export function playerWikiTitle(player: Player) {
  return player.wikiTitle ?? player.name.replace(/\s+/g, "_");
}

export function playerAvatarFallback(player: Player) {
  const initials = player.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue = Array.from(player.name).reduce((hash, char) => (hash * 33 + char.charCodeAt(0)) % 360, 0);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${escapeXml(player.name)}">
  <rect width="96" height="96" rx="48" fill="hsl(${hue} 52% 88%)"/>
  <circle cx="48" cy="37" r="18" fill="hsl(${hue} 42% 34%)"/>
  <path d="M18 88c5-22 20-34 30-34s25 12 30 34" fill="hsl(${hue} 42% 34%)"/>
  <text x="48" y="55" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#fff">${initials}</text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const brandFallbackPlayers: Record<string, Player[]> = {
  Wilson: [
    { name: "Roger Federer", country: "瑞士", note: "Wilson 品牌标志性球员" },
    { name: "Aryna Sabalenka", country: "白俄罗斯", note: "Wilson 现役代表球员" }
  ],
  Babolat: [
    { name: "Rafael Nadal", country: "西班牙", note: "Babolat 品牌标志性球员" },
    { name: "Carlos Alcaraz", country: "西班牙", note: "Babolat 现役代表球员" }
  ],
  HEAD: [
    { name: "Novak Djokovic", country: "塞尔维亚", note: "HEAD 品牌标志性球员" },
    { name: "Coco Gauff", country: "美国", note: "HEAD 现役代表球员" }
  ],
  Yonex: [
    { name: "Naomi Osaka", country: "日本", note: "Yonex 品牌代表球员" },
    { name: "Elena Rybakina", country: "哈萨克斯坦", note: "Yonex 现役代表球员" }
  ],
  Prince: [
    { name: "John Isner", country: "美国", note: "Prince 品牌代表球员" },
    { name: "Patrick Rafter", country: "澳大利亚", note: "Prince 历史代表球员" }
  ],
  Tecnifibre: [
    { name: "Daniil Medvedev", country: "俄罗斯", note: "Tecnifibre 品牌代表球员" },
    { name: "Iga Swiatek", country: "波兰", note: "Tecnifibre 品牌代表球员" }
  ],
  Dunlop: [
    { name: "Jack Draper", country: "英国", note: "Dunlop 品牌代表球员" },
    { name: "Kevin Anderson", country: "南非", note: "Dunlop 历史代表球员" }
  ]
};

export function escapeXml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function cleanText(input?: string | null) {
  if (!input) return "";
  if (input.includes("?")) return "";
  const text = input
    .replace(/\?{2,}/g, "")
    .replace(/\uFFFD+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.includes("?") && /[\u4e00-\u9fff]/.test(text) ? text.replace(/\?/g, "") : text;
}

export function cleanTraits(traits: string[]): Trait[] {
  return traits.filter((trait): trait is Trait => Boolean(trait) && !trait.includes("?") && TRAITS.includes(trait as Trait));
}

function cleanIntroText(input: string) {
  return input
    .replace(/是。/g, "是比较鲜明的。")
    .replace(/关键词是，/g, "关键词是综合性能，")
    .replace(/\?+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function seriesDescription(brand: string, series: string, category: string) {
  const key = `${brand} ${series}`;
  const descriptions: Record<string, string> = {
    "Wilson Blade": "这一系列偏向控制和击球反馈，适合主动发力、重视落点的进阶球员。",
    "Wilson Pro Staff": "这一系列强调传统手感、稳定拍面和精准控制，对击球基础要求较高。",
    "Wilson Clash": "这一系列以舒适和容错为核心，适合希望减少手臂负担的球员。",
    "Wilson Ultra": "这一系列主打直接力量和轻松出球，适合底线快速压制。",
    "Wilson Shift": "这一系列围绕现代上旋打法设计，强调拍头速度和弹道控制。",
    "Babolat Pure Drive": "这一系列是典型力量拍，出球速度快，甜区友好。",
    "Babolat Pure Aero": "这一系列强调旋转和高弹道，适合重上旋底线打法。",
    "Babolat Pure Strike": "这一系列偏向进攻控制，适合平击、抢点和主动变线。",
    "HEAD Speed": "这一系列比较全能，力量、控制和旋转之间平衡度高。",
    "HEAD Boom": "这一系列出球活泼，适合追求力量和易用性的球员。",
    "Yonex EZONE": "这一系列甜区友好，力量和容错表现突出。",
    "Yonex VCORE": "这一系列偏向旋转和主动加速，适合现代底线打法。",
    "Yonex Percept": "这一系列强调控制、稳定和细腻手感。",
    "Tecnifibre TFIGHT": "这一系列面向竞技进攻，稳定性和穿透力较强。",
    "Dunlop CX": "这一系列偏控制和手感，适合完整挥拍的球员。"
  };
  return descriptions[key] ?? `这支球拍的规格取向清晰，整体更接近“${category}”，适合围绕自身打法进行比较选择。`;
}
