import { getLastSync, getRackets } from "@/lib/data";
import { RacketBrowser } from "@/components/racket-browser";

export default async function Home() {
  const [rackets, lastSync] = await Promise.all([getRackets(), getLastSync()]);

  return (
    <main className="min-h-screen">
      <RacketBrowser
        rackets={rackets}
        lastSync={lastSync?.finishedAt?.toISOString() ?? lastSync?.startedAt.toISOString() ?? null}
      />
    </main>
  );
}
