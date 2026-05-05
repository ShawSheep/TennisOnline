import { describe, expect, it } from "vitest";
import { groupMatches, groupRacketsBySeries, selectDefaultVariant, seriesSlug } from "@/lib/series-utils";
import type { RacketListItem } from "@/lib/types";

function racket(overrides: Partial<RacketListItem>): RacketListItem {
  return {
    id: overrides.id ?? "id",
    slug: overrides.slug ?? "slug",
    brand: overrides.brand ?? "Babolat",
    brandSlug: overrides.brandSlug ?? "babolat",
    name: overrides.name ?? "Pure Aero 100",
    series: overrides.series ?? "Pure Aero",
    imageUrl: overrides.imageUrl ?? "https://example.com/racket.jpg",
    imageSourceUrl: "https://example.com",
    sourceUrl: "https://example.com",
    traits: overrides.traits ?? ["旋转", "力量"],
    audience: "test",
    description: "test",
    spec: overrides.spec ?? { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 320, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 65 },
    prices: overrides.prices ?? [{ currency: "CNY", region: "CN", amount: 1899, productUrl: "https://example.com", fetchedAt: "2026-05-05T00:00:00.000Z", sourceName: "优个网", sourceUrl: "https://example.com" }]
  };
}

describe("series utilities", () => {
  it("groups same brand and same series into one card", () => {
    const groups = groupRacketsBySeries([
      racket({ id: "1", name: "Pure Aero 100" }),
      racket({ id: "2", name: "Pure Aero 98", spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 327, balanceMm: 315, stringPattern: "16x20", stiffnessRa: 65 } })
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].variants).toHaveLength(2);
  });

  it("keeps same series names from different brands separate", () => {
    const groups = groupRacketsBySeries([
      racket({ id: "1", brand: "Brand A", brandSlug: "a", series: "Tour", name: "Tour 100" }),
      racket({ id: "2", brand: "Brand B", brandSlug: "b", series: "Tour", name: "Tour 98" })
    ]);

    expect(groups).toHaveLength(2);
  });

  it("selects the 100 sq in / around 300g real-image variant by default", () => {
    const variants = [
      racket({ id: "1", name: "Pure Aero 98", spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 327, balanceMm: 315, stringPattern: "16x20", stiffnessRa: 65 } }),
      racket({ id: "2", name: "Pure Aero 100" })
    ];

    expect(selectDefaultVariant(variants).name).toBe("Pure Aero 100");
  });

  it("matches group search against variant names", () => {
    const [group] = groupRacketsBySeries([
      racket({ id: "1", name: "Pure Aero 100" }),
      racket({ id: "2", name: "Pure Aero Rafa Origin" })
    ]);

    expect(groupMatches(group, { query: "Rafa", brand: "全部品牌", trait: "全部特点", specGroup: "全部规格", priceBand: "ALL", weight: "ALL", head: "ALL" })).toBe(true);
    expect(seriesSlug("Pure Aero")).toBe("pure-aero");
  });
});
