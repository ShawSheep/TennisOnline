import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RacketBrowser } from "@/components/racket-browser";
import type { RacketListItem } from "@/lib/types";

const rackets: RacketListItem[] = [
  {
    id: "1",
    slug: "babolat-pure-aero",
    brand: "Babolat",
    brandSlug: "babolat",
    name: "Pure Aero 100",
    series: "Pure Aero",
    imageUrl: "https://example.com/aero.jpg",
    imageSourceUrl: "https://example.com",
    sourceUrl: "https://example.com",
    traits: ["旋转", "力量"],
    audience: "上旋球员",
    description: "Spin frame",
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 300, swingWeight: 322, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 65 },
    prices: [
      { currency: "USD", region: "US", amount: 259, productUrl: "https://example.com", fetchedAt: "2026-05-05T00:00:00.000Z", sourceName: "Babolat", sourceUrl: "https://example.com" },
      { currency: "CNY", region: "CN", amount: 1899, productUrl: "https://example.com", fetchedAt: "2026-05-05T00:00:00.000Z", sourceName: "优个网", sourceUrl: "https://example.com" }
    ]
  },
  {
    id: "2",
    slug: "wilson-clash",
    brand: "Wilson",
    brandSlug: "wilson",
    name: "Clash 100 v2",
    series: "Clash",
    imageUrl: "https://example.com/clash.jpg",
    imageSourceUrl: "https://example.com",
    sourceUrl: "https://example.com",
    traits: ["舒适", "进阶"],
    audience: "舒适需求",
    description: "Comfort frame",
    spec: { headSizeSqIn: 100, lengthIn: 27, unstrungWeightG: 295, swingWeight: 313, balanceMm: 320, stringPattern: "16x19", stiffnessRa: 57 },
    prices: [{ currency: "CNY", region: "CN", amount: 1799, productUrl: "https://example.com", fetchedAt: "2026-05-05T00:00:00.000Z", sourceName: "优个网", sourceUrl: "https://example.com" }]
  }
];

describe("RacketBrowser", () => {
  it("filters rackets by trait and query", () => {
    render(<RacketBrowser rackets={rackets} lastSync="2026-05-05T00:00:00.000Z" />);
    fireEvent.change(screen.getByLabelText("特点"), { target: { value: "舒适" } });
    expect(screen.getByText("Clash 100 v2")).toBeInTheDocument();
    expect(screen.queryByText("Pure Aero 100")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("搜索品牌、型号、系列"), { target: { value: "aero" } });
    expect(screen.queryByText("Clash 100 v2")).not.toBeInTheDocument();
  });

  it("adds two rackets to compare panel", () => {
    render(<RacketBrowser rackets={rackets} lastSync="2026-05-05T00:00:00.000Z" />);
    const buttons = screen.getAllByTitle("加入对比");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByText("Babolat").length).toBeGreaterThan(0);
  });
});
