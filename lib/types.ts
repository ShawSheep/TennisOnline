export const TRAITS = ["力量", "旋转", "控制", "舒适", "轻量", "进阶", "竞技", "手感"] as const;

export type Trait = (typeof TRAITS)[number];

export type RacketSeed = {
  brand: string;
  brandSlug: string;
  brandWebsiteUrl: string;
  brandLogoUrl?: string;
  name: string;
  series: string;
  imageUrl: string;
  imageSourceUrl: string;
  sourceUrl: string;
  modelYear?: number | null;
  generation?: string | null;
  colorway?: string | null;
  variantLabel?: string | null;
  traits: Trait[];
  audience: string;
  description: string;
  spec: {
    headSizeSqIn?: number;
    lengthIn?: number;
    unstrungWeightG?: number;
    swingWeight?: number;
    balanceMm?: number;
    stringPattern?: string;
    stiffnessRa?: number;
  };
  prices: Array<{
    sourceName: string;
    sourceUrl: string;
    ruleKey: string;
    confidence: number;
    currency: "USD" | "CNY";
    region: "US" | "CN";
    amount: number;
    productUrl: string;
    fetchedAt: string;
  }>;
};

export type RacketListItem = {
  id: string;
  slug: string;
  brand: string;
  brandSlug: string;
  name: string;
  series: string;
  imageUrl: string;
  imageSourceUrl: string;
  sourceUrl: string;
  modelYear?: number | null;
  generation?: string | null;
  colorway?: string | null;
  variantLabel?: string | null;
  traits: Trait[];
  audience: string;
  description: string;
  spec: {
    headSizeSqIn: number | null;
    lengthIn: number | null;
    unstrungWeightG: number | null;
    swingWeight: number | null;
    balanceMm: number | null;
    stringPattern: string | null;
    stiffnessRa: number | null;
  } | null;
  prices: Array<{
    currency: string;
    region: string;
    amount: number;
    productUrl: string;
    fetchedAt: string;
    sourceName: string;
    sourceUrl: string;
  }>;
};
