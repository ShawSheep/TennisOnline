import * as cheerio from "cheerio";
import { parsePriceText } from "@/lib/racket-utils";

export type ParsedOffer = {
  name: string;
  price: {
    currency: "USD" | "CNY";
    amount: number;
  } | null;
  productUrl: string | null;
  imageUrl: string | null;
};

const productSelectors = [
  "[data-testid*=product]",
  ".product",
  ".product-item",
  ".product-tile",
  ".item",
  "li",
  "article"
];

export function parseProductOffers(html: string, baseUrl: string): ParsedOffer[] {
  const $ = cheerio.load(html);
  const offers = new Map<string, ParsedOffer>();

  for (const selector of productSelectors) {
    $(selector).each((_, element) => {
      const node = $(element);
      const text = node.text().replace(/\s+/g, " ").trim();
      if (!text || !/(racquet|racket|网球拍|pure|blade|speed|ezone|vcore|tfight|dunlop|head|wilson|babolat)/i.test(text)) {
        return;
      }

      const title =
        node.find("[class*=title], [class*=name], h2, h3, a").first().text().replace(/\s+/g, " ").trim() ||
        text.split(/(?:\$|¥|￥|USD|CNY|RMB)/i)[0].trim();
      const price = parsePriceText(text);
      const link = node.find("a[href]").first().attr("href") ?? null;
      const image = node.find("img[src], img[data-src]").first().attr("src") ?? node.find("img[data-src]").first().attr("data-src") ?? null;
      const normalizedTitle = title.slice(0, 100);

      if (normalizedTitle.length < 3) return;

      offers.set(normalizedTitle.toLowerCase(), {
        name: normalizedTitle,
        price: price as ParsedOffer["price"],
        productUrl: link ? new URL(link, baseUrl).toString() : null,
        imageUrl: image ? new URL(image, baseUrl).toString() : null
      });
    });
  }

  return Array.from(offers.values());
}

export function findOfferForModel(offers: ParsedOffer[], modelName: string) {
  const modelTokens = modelName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((token) => token.length > 1);

  return offers.find((offer) => {
    const text = offer.name.toLowerCase();
    return modelTokens.every((token) => text.includes(token));
  });
}
