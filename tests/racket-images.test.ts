import { describe, expect, it } from "vitest";
import { generatedRacketImage, racketProductImageUrl } from "@/lib/racket-images";

describe("racket images", () => {
  it("returns a product image url for known models", () => {
    expect(racketProductImageUrl("Wilson", "Blade 98 16x19 v9")).toContain("WB9816-1.jpg");
    expect(racketProductImageUrl("Babolat", "Pure Aero 100")).toContain("BARO-1.jpg");
  });

  it("generates a unique fallback image per model", () => {
    const blade = generatedRacketImage("Wilson", "Blade 98 16x19 v9");
    const clash = generatedRacketImage("Wilson", "Clash 100 v2");

    expect(blade).toContain("data:image/svg+xml");
    expect(blade).not.toBe(clash);
  });
});
