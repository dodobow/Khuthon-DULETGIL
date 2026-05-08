import type { RelayCard } from '@/types'

interface RouteProgressProps {
  startRegion: string
  routePath: RelayCard[]
}

export default function RouteProgress({
  startRegion,
  routePath,
}: RouteProgressProps) {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-cyan-300">현재 문화 탐험 루트</p>
          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
            {routePath.length} / 5
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-200">
            {startRegion}
          </span>
          {routePath.map(card => (
            <div key={card.id} className="flex shrink-0 items-center gap-2">
              <span className="font-bold text-cyan-300">→</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                {card.region} · {card.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
