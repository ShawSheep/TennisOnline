import { describe, expect, it } from "vitest";
import { findOfferForModel, parseProductOffers } from "@/lib/sync-parsers";

const fixture = `
  <article class="product-tile">
    <a href="/pure-drive-100"><img src="/pure-drive.jpg" /></a>
    <h2>Pure Drive 100 Tennis Racquet</h2>
    <span>$259.00</span>
  </article>
  <li class="product-item">
    <a href="/blade-98">Wilson Blade 98 16x19 v9 网球拍</a>
    <span>￥1,899</span>
  </li>
`;

describe("sync parsers", () => {
  it("extracts product offers from mixed product card markup", () => {
    const offers = parseProductOffers(fixture, "https://example.com/catalog");
    expect(offers).toHaveLength(2);
    expect(offers[0]).toMatchObject({
      name: "Pure Drive 100 Tennis Racquet",
      price: { currency: "USD", amount: 259 },
      productUrl: "https://example.com/pure-drive-100",
      imageUrl: "https://example.com/pure-drive.jpg"
    });
  });

  it("matches an offer to a known model", () => {
    const offers = parseProductOffers(fixture, "https://example.com/catalog");
    expect(findOfferForModel(offers, "Blade 98 16x19 v9")?.price).toEqual({ currency: "CNY", amount: 1899 });
  });
});
