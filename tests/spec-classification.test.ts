import { describe, expect, it } from "vitest";
import { classifyHeadSize, classifyStringPattern, classifyWeight, specClass } from "@/lib/spec-classification";

describe("spec classification", () => {
  it("classifies individual spec dimensions", () => {
    expect(classifyHeadSize(98)).toBe("小拍面");
    expect(classifyHeadSize(100)).toBe("标准拍面");
    expect(classifyHeadSize(105)).toBe("大拍面");
    expect(classifyStringPattern("16x19")).toBe("开放线床");
    expect(classifyStringPattern("18x20")).toBe("密集线床");
    expect(classifyWeight(280)).toBe("轻量");
  });

  it("creates a combined spec class", () => {
    expect(specClass({ headSizeSqIn: 98, lengthIn: 27, unstrungWeightG: 315, swingWeight: 320, balanceMm: 315, stringPattern: "18x20", stiffnessRa: 63 })).toBe("竞技控制型");
    expect(specClass({ headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 320, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 67 })).toBe("旋转力量型");
    expect(specClass({ headSizeSqIn: 110, lengthIn: 27.5, unstrungWeightG: 260, swingWeight: 310, balanceMm: 345, stringPattern: "16x19", stiffnessRa: 69 })).toBe("大拍面轻量型");
  });
});
