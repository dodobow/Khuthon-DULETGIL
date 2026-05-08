import type { RelayCard } from '@/types'

interface CultureRouteProps {
  selectedRegion: string
  routePath: RelayCard[]
}

export default function CultureRoute({
  selectedRegion,
  routePath,
}: CultureRouteProps) {
  return (
    <section className="rounded-2xl border border-cyan-400/30 bg-white/10 p-4">
      <div className="space-y-3 text-center">
        <p className="text-sm font-bold text-cyan-300">
          내가 만든 문화 탐험 루트
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-lg font-black text-white">
          <span>{selectedRegion}</span>
          {routePath.map(card => (
            <span key={card.id} className="flex items-center gap-2">
              <span className="text-cyan-300">→</span>
              <span>{card.region}</span>
            </span>
          ))}
        </div>
        <p className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
          {routePath.map(card => card.title).join(' · ')}
        </p>
      </div>
    </section>
  )
}
