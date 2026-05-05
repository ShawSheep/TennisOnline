import { notFound } from "next/navigation";
import { getRackets } from "@/lib/data";
import { groupRacketsBySeries } from "@/lib/series-utils";
import { SeriesDetail } from "@/components/series-detail";

type Props = {
  params: Promise<{
    brandSlug: string;
    seriesSlug: string;
  }>;
};

export default async function SeriesPage({ params }: Props) {
  const { brandSlug, seriesSlug } = await params;
  const groups = groupRacketsBySeries(await getRackets());
  const group = groups.find((item) => item.brandSlug === brandSlug && item.slug === seriesSlug);

  if (!group) notFound();

  return <SeriesDetail group={group} />;
}
