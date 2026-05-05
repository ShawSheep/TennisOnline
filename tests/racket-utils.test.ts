import { describe, expect, it } from "vitest";
import { lowestPrice, mapTraits, normalizeModelName, parsePriceText } from "@/lib/racket-utils";
import type { RacketListItem } from "@/lib/types";

describe("racket utilities", () => {
  it("normalizes model names for dedupe", () => {
    expect(normalizeModelName("Blade 98 16x19 v9™")).toBe("blade 98 16x19");
    expect(normalizeModelName("Pure Drive 100 2025")).toBe("pure drive 100");
  });

  it("maps specs and series into Chinese traits", () => {
    expect(mapTraits({ name: "Pure Aero 100", series: "Pure Aero", stringPattern: "16x19", stiffnessRa: 65 })).toEqual(
      expect.arrayContaining(["旋转", "进阶"])
    );
    expect(mapTraits({ name: "Clash 100 v2", series: "Clash", stiffnessRa: 57 })).toEqual(expect.arrayContaining(["舒适"]));
    expect(mapTraits({ name: "Prestige Pro", series: "Prestige", unstrungWeightG: 320 })).toEqual(expect.arrayContaining(["竞技", "手感"]));
  });

  it("parses USD and CNY prices", () => {
    expect(parsePriceText("$259.00")).toEqual({ currency: "USD", amount: 259 });
    expect(parsePriceText("￥1,899")).toEqual({ currency: "CNY", amount: 1899 });
    expect(parsePriceText("会员价待定")).toBeNull();
  });

  it("prefers CNY prices when no region is specified", () => {
    const racket = {
      prices: [
        { currency: "USD", region: "US", amount: 199 },
        { currency: "CNY", region: "CN", amount: 1499 }
      ]
    } as RacketListItem;

    expect(lowestPrice(racket)?.currency).toBe("CNY");
  });
});
