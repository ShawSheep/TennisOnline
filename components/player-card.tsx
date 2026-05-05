"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { playerAvatarFallback, playerWikiTitle, type Player } from "@/lib/racket-profiles";

type Props = {
  player: Player;
};

type WikiSummary = {
  thumbnail?: {
    source?: string;
  };
  content_urls?: {
    desktop?: {
      page?: string;
    };
  };
};

export function PlayerCard({ player }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pageUrl, setPageUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const title = playerWikiTitle(player);

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: WikiSummary | null) => {
        if (cancelled || !data) return;
        setImageUrl(data.thumbnail?.source ?? null);
        setPageUrl(data.content_urls?.desktop?.page ?? null);
      })
      .catch(() => {
        if (!cancelled) setImageUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [player]);

  return (
    <article className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
      <img
        src={imageUrl ?? playerAvatarFallback(player)}
        alt={player.name}
        className="h-[72px] w-[72px] rounded-md object-cover"
      />
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold leading-tight">{player.name}</h3>
            <p className="mt-1 text-xs font-semibold text-court">{player.country}</p>
          </div>
          {pageUrl ? (
            <a
              href={pageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink/50 transition hover:border-court hover:text-court"
              title="查看球员资料"
            >
              <ExternalLink size={15} />
            </a>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/65">{player.note}</p>
      </div>
    </article>
  );
}
