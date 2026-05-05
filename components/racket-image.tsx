"use client";

import { useState } from "react";
import { generatedRacketImage } from "@/lib/racket-images";

type Props = {
  brand: string;
  name: string;
  src: string;
  className?: string;
};

export function RacketImage({ brand, name, src, className }: Props) {
  const [imageSrc, setImageSrc] = useState(normalizeInitialSrc(src, brand, name));

  return (
    <img
      src={imageSrc}
      alt={`${brand} ${name}`}
      className={`${className ?? ""} racket-product-image`}
      onError={() => setImageSrc(generatedRacketImage(brand, name))}
    />
  );
}

function normalizeInitialSrc(src: string, brand: string, name: string) {
  if (src.startsWith("data:image/svg+xml")) return generatedRacketImage(brand, name);
  return src;
}
