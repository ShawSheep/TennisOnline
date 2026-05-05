import { mapTraits, normalizeModelName, slugify } from "@/lib/racket-utils";
import { racketImageSourceUrl, racketProductImageUrl } from "@/lib/racket-images";
import type { RacketSeed } from "@/lib/types";

const fetchedAt = "2026-05-05T00:00:00.000Z";

const brandMeta = {
  Wilson: {
    slug: "wilson",
    websiteUrl: "https://www.wilson.com/en-us/tennis/rackets",
    logoUrl: "https://www.wilson.com/favicon.ico",
    source: "Wilson 官网"
  },
  Babolat: {
    slug: "babolat",
    websiteUrl: "https://www.babolat.com/us/tennis/racquets.html",
    logoUrl: "https://www.babolat.com/favicon.ico",
    source: "Babolat 官网"
  },
  HEAD: {
    slug: "head",
    websiteUrl: "https://www.head.com/en_US/tennis/racquets.html",
    logoUrl: "https://www.head.com/favicon.ico",
    source: "HEAD 官网"
  },
  Yonex: {
    slug: "yonex",
    websiteUrl: "https://www.yonex.com/tennis/racquets",
    logoUrl: "https://www.yonex.com/favicon.ico",
    source: "Yonex 官网"
  },
  Prince: {
    slug: "prince",
    websiteUrl: "https://princetennis.com/racquets",
    logoUrl: "https://princetennis.com/favicon.ico",
    source: "Prince 官网"
  },
  Tecnifibre: {
    slug: "tecnifibre",
    websiteUrl: "https://www.tecnifibre.com/en/tennis/rackets.html",
    logoUrl: "https://www.tecnifibre.com/favicon.ico",
    source: "Tecnifibre 官网"
  },
  Dunlop: {
    slug: "dunlop",
    websiteUrl: "https://dunlopsports.com/products/tennis/rackets",
    logoUrl: "https://dunlopsports.com/favicon.ico",
    source: "Dunlop 官网"
  }
} as const;

type RawRacket = {
  brand: keyof typeof brandMeta;
  name: string;
  series: string;
  audience: string;
  description: string;
  usd: number;
  cny: number;
  spec: RacketSeed["spec"];
};

const rawRackets: RawRacket[] = [
  {
    brand: "Wilson",
    name: "Blade 98 16x19 v9",
    series: "Blade",
    audience: "进阶到竞技型底线球员",
    description: "偏控制和手感，适合主动发力并希望保留旋转窗口的选手。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 320, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 62 }
  },
  {
    brand: "Wilson",
    name: "Pro Staff 97 v14",
    series: "Pro Staff",
    audience: "追求传统击球反馈的竞技球员",
    description: "小拍面和较高静态重量带来清晰手感，容错要求更高。",
    usd: 279,
    cny: 2099,
    spec: { headSizeSqIn: 97, lengthIn: 27, unstrungWeightG: 315, swingWeight: 321, balanceMm: 310, stringPattern: "16x19", stiffnessRa: 66 }
  },
  {
    brand: "Wilson",
    name: "Clash 100 v2",
    series: "Clash",
    audience: "重视舒适度的进阶球员",
    description: "柔和框体和 100 拍面兼顾力量、容错与手臂友好。",
    usd: 249,
    cny: 1799,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 295, swingWeight: 313, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 57 }
  },
  {
    brand: "Wilson",
    name: "Ultra 100 v4",
    series: "Ultra",
    audience: "喜欢直接力量的底线球员",
    description: "易出球、甜区友好，适合用简洁动作获得速度。",
    usd: 249,
    cny: 1799,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 317, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 70 }
  },
  {
    brand: "Wilson",
    name: "Shift 99 Pro v1",
    series: "Shift",
    audience: "现代上旋型进阶球员",
    description: "面向旋转和可控力量，适合重上旋回合打法。",
    usd: 269,
    cny: 1999,
    spec: { headSizeSqIn: 99, lengthIn: 27, unstrungWeightG: 315, swingWeight: 332, balanceMm: 315, stringPattern: "18x20", stiffnessRa: 68 }
  },
  {
    brand: "Wilson",
    name: "Blade 100 v9",
    series: "Blade",
    audience: "想要 Blade 手感但需要更多容错的进阶球员",
    description: "100 拍面降低上手门槛，保留 Blade 系列偏控制的击球反馈。",
    usd: 249,
    cny: 1799,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 318, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 61 }
  },
  {
    brand: "Wilson",
    name: "RF 01 Pro",
    series: "RF",
    audience: "需要稳定拍面和进攻手感的高阶球员",
    description: "偏竞技的全场框体，强调稳定、穿透和清晰反馈。",
    usd: 299,
    cny: 2299,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 320, swingWeight: 330, balanceMm: 315, stringPattern: "16x19", stiffnessRa: 67 }
  },
  {
    brand: "Babolat",
    name: "Pure Drive 100",
    series: "Pure Drive",
    audience: "想要轻松力量的广泛人群",
    description: "经典力量型球拍，出球速度快，100 拍面提供稳定容错。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 320, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 71 }
  },
  {
    brand: "Babolat",
    name: "Pure Aero 100",
    series: "Pure Aero",
    audience: "重上旋底线球员",
    description: "强调旋转和高弹道，适合主动拉上旋制造压迫。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 322, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 65 }
  },
  {
    brand: "Babolat",
    name: "Pure Strike 98 16x19",
    series: "Pure Strike",
    audience: "进攻型全场球员",
    description: "偏控制和进攻精度，适合平击、抢点和主动变线。",
    usd: 269,
    cny: 1999,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 330, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 67 }
  },
  {
    brand: "Babolat",
    name: "Pure Aero Rafa Origin",
    series: "Pure Aero",
    audience: "力量充沛的竞技型旋转球员",
    description: "更高重量和挥重提供沉重球质，适合力量基础扎实的选手。",
    usd: 329,
    cny: 2499,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 317, swingWeight: 371, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 70 }
  },
  {
    brand: "Babolat",
    name: "Pure Drive Lite",
    series: "Pure Drive",
    audience: "初中级和偏轻量需求球员",
    description: "保留 Pure Drive 的力量特征，同时降低上手门槛。",
    usd: 239,
    cny: 1599,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 270, swingWeight: 303, balanceMm: 330, stringPattern: "16x19", stiffnessRa: 72 }
  },
  {
    brand: "Babolat",
    name: "Pure Aero 98",
    series: "Pure Aero",
    audience: "需要旋转和更高控制精度的竞技球员",
    description: "比 100 拍面更精准，适合高挥速上旋进攻。",
    usd: 279,
    cny: 2099,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 327, balanceMm: 315, stringPattern: "16x20", stiffnessRa: 65 }
  },
  {
    brand: "Babolat",
    name: "Pure Strike 100",
    series: "Pure Strike",
    audience: "想要控制但需要更大甜区的进阶球员",
    description: "100 拍面提升容错，适合从力量拍过渡到控制拍的人群。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 322, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 66 }
  },
  {
    brand: "HEAD",
    name: "Speed MP 2024",
    series: "Speed",
    audience: "全能型进阶球员",
    description: "力量、控制和旋转比较均衡，适合多拍相持和转换节奏。",
    usd: 269,
    cny: 1999,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 323, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 60 }
  },
  {
    brand: "HEAD",
    name: "Radical MP 2023",
    series: "Radical",
    audience: "喜欢主动进攻的全场球员",
    description: "中等力量配合清晰落点控制，适合快节奏击球。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 300, swingWeight: 323, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 65 }
  },
  {
    brand: "HEAD",
    name: "Gravity MP 2023",
    series: "Gravity",
    audience: "看重甜区和舒适的底线球员",
    description: "大甜区和柔和反馈带来容错，适合稳定拉锯。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 295, swingWeight: 323, balanceMm: 325, stringPattern: "16x20", stiffnessRa: 59 }
  },
  {
    brand: "HEAD",
    name: "Extreme MP 2024",
    series: "Extreme",
    audience: "上旋进攻型球员",
    description: "开放线床和快速挥速取向，帮助制造弹跳和深度。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 318, balanceMm: 325, stringPattern: "16x19", stiffnessRa: 65 }
  },
  {
    brand: "HEAD",
    name: "Prestige Pro 2023",
    series: "Prestige",
    audience: "高水平控制型球员",
    description: "低弹、细腻、方向感强，适合完整挥拍和精准落点。",
    usd: 269,
    cny: 2099,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 320, swingWeight: 330, balanceMm: 310, stringPattern: "18x20", stiffnessRa: 60 }
  },
  {
    brand: "HEAD",
    name: "Boom MP 2024",
    series: "Boom",
    audience: "力量和易用性优先的进阶球员",
    description: "出球活泼，100 拍面和 300g 重量适合现代底线节奏。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 295, swingWeight: 318, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 66 }
  },
  {
    brand: "HEAD",
    name: "Boom Pro 2024",
    series: "Boom",
    audience: "喜欢力量但希望拍面更稳定的高阶球员",
    description: "更高重量带来稳定和穿透，适合主动进攻。",
    usd: 269,
    cny: 1999,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 310, swingWeight: 329, balanceMm: 315, stringPattern: "16x19", stiffnessRa: 66 }
  },
  {
    brand: "Yonex",
    name: "EZONE 100",
    series: "EZONE",
    audience: "力量与容错并重的进阶球员",
    description: "甜区友好，出球轻松，适合现代底线击球。",
    usd: 269,
    cny: 1999,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 322, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 67 }
  },
  {
    brand: "Yonex",
    name: "EZONE 98",
    series: "EZONE",
    audience: "想要更精准力量的进阶球员",
    description: "比 100 更强调落点和挥拍反馈，仍保留易用力量。",
    usd: 269,
    cny: 1999,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 318, balanceMm: 315, stringPattern: "16x19", stiffnessRa: 65 }
  },
  {
    brand: "Yonex",
    name: "VCORE 100",
    series: "VCORE",
    audience: "上旋底线球员",
    description: "适合通过拍头速度和开放线床制造旋转。",
    usd: 269,
    cny: 1999,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 322, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 66 }
  },
  {
    brand: "Yonex",
    name: "VCORE 98",
    series: "VCORE",
    audience: "需要旋转和精度的竞技球员",
    description: "更灵活的 98 拍面适合主动加速和变线。",
    usd: 269,
    cny: 1999,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 318, balanceMm: 315, stringPattern: "16x19", stiffnessRa: 62 }
  },
  {
    brand: "Yonex",
    name: "Percept 97",
    series: "Percept",
    audience: "控制和手感优先的进阶球员",
    description: "柔和、稳定、指向性强，适合细腻落点控制。",
    usd: 269,
    cny: 2099,
    spec: { headSizeSqIn: 97, lengthIn: 27, unstrungWeightG: 310, swingWeight: 320, balanceMm: 310, stringPattern: "16x19", stiffnessRa: 60 }
  },
  {
    brand: "Yonex",
    name: "VCORE 95",
    series: "VCORE",
    audience: "高水平旋转控制型球员",
    description: "小拍面带来更明确的落点反馈，适合高拍头速度。",
    usd: 269,
    cny: 2099,
    spec: { headSizeSqIn: 95, lengthIn: 27, unstrungWeightG: 310, swingWeight: 322, balanceMm: 315, stringPattern: "16x20", stiffnessRa: 61 }
  },
  {
    brand: "Yonex",
    name: "Percept 100D",
    series: "Percept",
    audience: "想要密集线床和 100 拍面容错的控制型球员",
    description: "18x19 线床增加方向感，100 拍面保留稳定甜区。",
    usd: 269,
    cny: 2099,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 305, swingWeight: 325, balanceMm: 320, stringPattern: "18x19", stiffnessRa: 62 }
  },
  {
    brand: "Prince",
    name: "Phantom 100X 305",
    series: "Phantom",
    audience: "舒适控制型进阶球员",
    description: "柔和框体降低冲击感，适合寻找手感和旋转余量的选手。",
    usd: 249,
    cny: 1699,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 305, swingWeight: 320, balanceMm: 315, stringPattern: "16x18", stiffnessRa: 59 }
  },
  {
    brand: "Prince",
    name: "Tour 100P",
    series: "Tour",
    audience: "偏控制的全场球员",
    description: "18x20 线床提供方向控制，同时保留 100 拍面的容错。",
    usd: 249,
    cny: 1699,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 305, swingWeight: 324, balanceMm: 320, stringPattern: "18x20", stiffnessRa: 62 }
  },
  {
    brand: "Prince",
    name: "Beast 100",
    series: "Beast",
    audience: "喜欢力量和旋转的进阶球员",
    description: "直接力量、开放线床和较好容错，适合底线进攻。",
    usd: 229,
    cny: 1499,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 320, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 67 }
  },
  {
    brand: "Prince",
    name: "Warrior 100",
    series: "Warrior",
    audience: "初中级到进阶过渡球员",
    description: "易用、稳定、价格友好，适合建立稳定底线节奏。",
    usd: 199,
    cny: 1299,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 318, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 66 }
  },
  {
    brand: "Prince",
    name: "Ripstick 100",
    series: "Ripstick",
    audience: "喜欢轻松力量和旋转的底线球员",
    description: "开放线床和力量取向，适合制造高弹道和深度。",
    usd: 229,
    cny: 1499,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 320, balanceMm: 320, stringPattern: "16x18", stiffnessRa: 68 }
  },
  {
    brand: "Prince",
    name: "Phantom 100P",
    series: "Phantom",
    audience: "舒适控制型全场球员",
    description: "密集线床和柔和框体，适合追求细腻落点。",
    usd: 249,
    cny: 1699,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 305, swingWeight: 322, balanceMm: 315, stringPattern: "18x20", stiffnessRa: 59 }
  },
  {
    brand: "Tecnifibre",
    name: "TFIGHT 305 ISOFLEX",
    series: "TFIGHT",
    audience: "竞技型控制球员",
    description: "18x19 线床兼顾控制与旋转，适合高挥速进攻。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 329, balanceMm: 325, stringPattern: "18x19", stiffnessRa: 64 }
  },
  {
    brand: "Tecnifibre",
    name: "TFIGHT 300 ISOFLEX",
    series: "TFIGHT",
    audience: "进阶全场球员",
    description: "较易上手的竞技框体，平衡力量、旋转和落点。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 300, swingWeight: 323, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 66 }
  },
  {
    brand: "Tecnifibre",
    name: "TF40 305 16M",
    series: "TF40",
    audience: "偏控制和手感的高阶球员",
    description: "清晰反馈和稳定拍面，适合主动发力压线。",
    usd: 249,
    cny: 1799,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 326, balanceMm: 325, stringPattern: "16x19", stiffnessRa: 64 }
  },
  {
    brand: "Tecnifibre",
    name: "TF-X1 300",
    series: "TF-X1",
    audience: "力量型进阶球员",
    description: "强调出球速度和容错，适合追求直接进攻的人群。",
    usd: 249,
    cny: 1699,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 320, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 71 }
  },
  {
    brand: "Tecnifibre",
    name: "TFIGHT 315 ISOFLEX",
    series: "TFIGHT",
    audience: "力量基础扎实的竞技球员",
    description: "更高静态重量提升稳定和穿透，适合主动压迫。",
    usd: 269,
    cny: 1999,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 315, swingWeight: 333, balanceMm: 315, stringPattern: "16x19", stiffnessRa: 66 }
  },
  {
    brand: "Tecnifibre",
    name: "TF40 315 18M",
    series: "TF40",
    audience: "偏传统控制的高阶球员",
    description: "密集线床和重型框体强调方向感和稳定拍面。",
    usd: 259,
    cny: 1899,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 315, swingWeight: 330, balanceMm: 315, stringPattern: "18x20", stiffnessRa: 64 }
  },
  {
    brand: "Dunlop",
    name: "CX 200 Tour 18x20",
    series: "CX",
    audience: "高阶控制型球员",
    description: "低弹控制框体，适合完整挥拍和精确线路。",
    usd: 239,
    cny: 1599,
    spec: { headSizeSqIn: 95, lengthIn: 27, unstrungWeightG: 315, swingWeight: 326, balanceMm: 310, stringPattern: "18x20", stiffnessRa: 62 }
  },
  {
    brand: "Dunlop",
    name: "CX 400 Tour",
    series: "CX",
    audience: "兼顾控制和易用的进阶球员",
    description: "100 拍面提升容错，CX 系列手感更亲和。",
    usd: 229,
    cny: 1499,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 318, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 67 }
  },
  {
    brand: "Dunlop",
    name: "FX 500",
    series: "FX",
    audience: "力量型底线球员",
    description: "弹性和出球速度突出，适合追求深度和速度。",
    usd: 229,
    cny: 1499,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 321, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 69 }
  },
  {
    brand: "Dunlop",
    name: "SX 300",
    series: "SX",
    audience: "上旋进攻型球员",
    description: "为旋转和高弹道设计，适合拉转压制对手。",
    usd: 229,
    cny: 1499,
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 318, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 68 }
  },
  {
    brand: "Dunlop",
    name: "LX 1000",
    series: "LX",
    audience: "需要大甜区和轻松力量的休闲球员",
    description: "大拍面和轻松出球降低门槛，适合休闲与双打。",
    usd: 219,
    cny: 1399,
    spec: { headSizeSqIn: 115, lengthIn: 27.5, unstrungWeightG: 255, swingWeight: 310, balanceMm: 355, stringPattern: "16x19", stiffnessRa: 70 }
  },
  {
    brand: "Dunlop",
    name: "SX 300 Tour",
    series: "SX",
    audience: "上旋打法的高阶球员",
    description: "更高重量提升稳定，保留 SX 系列的旋转取向。",
    usd: 239,
    cny: 1599,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 324, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 68 }
  },
  {
    brand: "Dunlop",
    name: "FX 500 Tour",
    series: "FX",
    audience: "需要力量和稳定的进阶到竞技球员",
    description: "98 拍面和更高重量让力量型框体更可控。",
    usd: 239,
    cny: 1599,
    spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 322, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 69 }
  }
];

export const racketSeeds: RacketSeed[] = rawRackets.map((racket) => {
  const brand = brandMeta[racket.brand];
  const normalizedName = normalizeModelName(racket.name);
  const productSlug = slugify(`${brand.slug}-${normalizedName}`);
  const sourceUrl = `${brand.websiteUrl}?q=${encodeURIComponent(racket.name)}`;

  return {
    brand: racket.brand,
    brandSlug: brand.slug,
    brandWebsiteUrl: brand.websiteUrl,
    brandLogoUrl: brand.logoUrl,
    name: racket.name,
    series: racket.series,
    imageUrl: racketProductImageUrl(racket.brand, racket.name),
    imageSourceUrl: racketImageSourceUrl(brand.websiteUrl, racket.brand, racket.name),
    sourceUrl,
    modelYear: parseModelYear(racket.name),
    generation: parseGeneration(racket.name),
    colorway: null,
    variantLabel: racket.name,
    traits: mapTraits({ ...racket.spec, name: racket.name, series: racket.series }),
    audience: racket.audience,
    description: racket.description,
    spec: racket.spec,
    prices: [
      {
        sourceName: brand.source,
        sourceUrl: brand.websiteUrl,
        ruleKey: `${brand.slug}-official`,
        confidence: 85,
        currency: "USD",
        region: "US",
        amount: racket.usd,
        productUrl: sourceUrl,
        fetchedAt
      },
      {
        sourceName: racket.brand === "HEAD" ? "动库商城" : "优个网",
        sourceUrl: racket.brand === "HEAD" ? "https://www.dku51.com/" : "https://www.yoger.com.cn/",
        ruleKey: racket.brand === "HEAD" ? "dku-cn-price-list" : "yoger-cn-list",
        confidence: 70,
        currency: "CNY",
        region: "CN",
        amount: racket.cny,
        productUrl:
          racket.brand === "HEAD"
            ? "https://www.dku51.com/price_list-219.html"
            : "https://www.yoger.com.cn/products_1214.html",
        fetchedAt
      }
    ]
  };
});

function parseModelYear(name: string) {
  const match = name.match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function parseGeneration(name: string) {
  return name.match(/\b(v\d+)\b/i)?.[1] ?? null;
}
