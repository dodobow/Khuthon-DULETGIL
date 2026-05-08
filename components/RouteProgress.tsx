import type { RelayCard } from '@/types'

interface RouteProgressProps {
  startRegion: string
  startTitle: string
  routePath: RelayCard[]
}

export default function RouteProgress({
  startRegion,
  startTitle,
  routePath,
}: RouteProgressProps) {
  return (
    <section className="rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-5 sm:p-6 shadow-sm">
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#787774]">Itinerary Ledger</p>
          <span className="font-mono text-xs font-medium text-[#111111]">
            {routePath.length} / 5 STOPS
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="flex items-center gap-2 rounded-md border border-[#EAEAEA] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <span className="font-mono text-[10px] text-[#787774]">START</span>
            <span className="font-medium text-[#111111]">{startRegion}</span>
            <span className="text-[#787774]">· {startTitle}</span>
          </div>
          {routePath.map((card, idx) => (
            <div key={card.id} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="font-mono text-[10px] text-[#A09F9C]">→</span>
              <div className="flex items-center gap-2 rounded-md border border-[#111111] bg-[#111111] px-3 py-2 text-white shadow-sm">
                <span className="font-mono text-[10px] text-[#A09F9C]">0{idx + 1}</span>
                <span className="font-medium">{card.region}</span>
                <span className="text-[#A09F9C]">· {card.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
