import type { RacketListItem } from "@/lib/types";

export const SPEC_CLASSES = ["竞技控制型", "标准全能型", "旋转力量型", "大拍面轻量型", "加长力量型"] as const;

export type SpecClass = (typeof SPEC_CLASSES)[number];

type Spec = NonNullable<RacketListItem["spec"]>;

export function classifyHeadSize(headSizeSqIn?: number | null) {
  if (!headSizeSqIn) return "拍面待补";
  if (headSizeSqIn <= 98) return "小拍面";
  if (headSizeSqIn <= 100) return "标准拍面";
  return "大拍面";
}

export function classifyStringPattern(stringPattern?: string | null) {
  if (!stringPattern) return "线床待补";
  const [main, cross] = stringPattern.split("x").map(Number);
  if (!main || !cross) return stringPattern;
  if (main <= 16 && cross <= 19) return "开放线床";
  if (main >= 18) return "密集线床";
  return "均衡线床";
}

export function classifyWeight(unstrungWeightG?: number | null) {
  if (!unstrungWeightG) return "重量待补";
  if (unstrungWeightG <= 285) return "轻量";
  if (unstrungWeightG <= 305) return "标准重量";
  return "重型";
}

export function classifyLength(lengthIn?: number | null) {
  if (!lengthIn) return "长度待补";
  if (lengthIn > 27) return "加长";
  return "标准长度";
}

export function specClass(spec: Spec | null): SpecClass {
  if (!spec) return "标准全能型";
  const head = spec.headSizeSqIn ?? 100;
  const weight = spec.unstrungWeightG ?? 300;
  const length = spec.lengthIn ?? 27;
  const stringPattern = spec.stringPattern ?? "16x19";

  if (length > 27 || head >= 105) return weight <= 285 ? "大拍面轻量型" : "加长力量型";
  if (head <= 98 && weight >= 305) return "竞技控制型";
  if (stringPattern === "16x19" && head >= 100 && weight >= 295) return "旋转力量型";
  if (weight <= 285 || head > 100) return "大拍面轻量型";
  return "标准全能型";
}

export function specBadges(spec: Spec | null) {
  if (!spec) return ["参数待补"];
  return [
    classifyHeadSize(spec.headSizeSqIn),
    classifyStringPattern(spec.stringPattern),
    classifyWeight(spec.unstrungWeightG),
    classifyLength(spec.lengthIn)
  ];
}
