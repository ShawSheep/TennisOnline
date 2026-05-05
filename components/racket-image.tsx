"use client";

import { useEffect, useMemo, useState } from "react";
import { generatedRacketImage } from "@/lib/racket-images";

type Props = {
  brand: string;
  name: string;
  src: string;
  className?: string;
};

export function RacketImage({ brand, name, src, className }: Props) {
  const fallbackSrc = useMemo(() => generatedRacketImage(brand, name), [brand, name]);
  const [imageSrc, setImageSrc] = useState(() => normalizeInitialSrc(src, fallbackSrc));

  useEffect(() => {
    setImageSrc(normalizeInitialSrc(src, fallbackSrc));
  }, [fallbackSrc, src]);

  return (
    <img
      src={imageSrc}
      alt={`${brand} ${name}`}
      className={`${className ?? ""} racket-product-image`}
      onError={() => {
        if (imageSrc !== fallbackSrc) setImageSrc(fallbackSrc);
      }}
    />
  );
}

function normalizeInitialSrc(src: string | null | undefined, fallbackSrc: string) {
  if (!src || src.startsWith("data:image/svg+xml")) return fallbackSrc;
  return src;
}
