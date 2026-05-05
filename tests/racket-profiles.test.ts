import { describe, expect, it } from "vitest";
import { cleanText, cleanTraits, playerWikiTitle, racketIntro, racketPlayers } from "@/lib/racket-profiles";
import type { RacketListItem } from "@/lib/types";

const racket = {
  brand: "Babolat",
  name: "Pure Aero 98",
  series: "Pure Aero",
  audience: "需要旋转和更高控制精度的竞技球员",
  description: "比 100 拍面更精准，适合高挥速上旋进攻。",
  traits: ["旋转", "竞技"],
  spec: { headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 305, swingWeight: 327, balanceMm: 315, stringPattern: "16x20", stiffnessRa: 65 }
} as RacketListItem;

describe("racket profiles", () => {
  it("builds a readable intro from racket specs", () => {
    expect(racketIntro(racket).join(" ")).toContain("Pure Aero 98");
    expect(racketIntro(racket).join(" ")).toContain("98 平方英寸拍面");
  });

  it("returns representative players for a racket series", () => {
    expect(racketPlayers(racket).map((player) => player.name)).toEqual(expect.arrayContaining(["Rafael Nadal", "Carlos Alcaraz"]));
  });

  it("builds a Wikipedia title for player photos", () => {
    expect(playerWikiTitle({ name: "Rafael Nadal", country: "西班牙", note: "test" })).toBe("Rafael_Nadal");
  });

  it("removes corrupted question mark runs from generated copy", () => {
    expect(cleanText("?????100 ??? 300g ?????")).toBe("");
    expect(cleanTraits(["力量", "??", "控制"])).toEqual(["力量", "控制"]);
    expect(racketIntro({ ...racket, audience: "????", description: "????", traits: ["??" as never] }).join("")).not.toContain("?");
  });
});
