import type { RelayCard } from '@/types'

interface CultureRouteProps {
  selectedRegion: string
  routePath: RelayCard[]
  connectionReasons?: string[]
}

export default function CultureRoute({
  selectedRegion,
  routePath,
  connectionReasons,
}: CultureRouteProps) {
  return (
    <section className="rounded-lg border border-[#EAEAEA] bg-[#FBFBFA] p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-[#EAEAEA] pb-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#787774]">
            route ledger
          </p>
          <span className="font-mono text-xs text-[#111111]">
            {routePath.length + 1} stops
          </span>
        </div>

        <div className="space-y-3">
          <div className="rounded-md border border-[#EAEAEA] bg-white px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#787774]">
              start
            </p>
            <p className="mt-1 font-medium text-[#111111]">{selectedRegion}</p>
          </div>

          {routePath.map((card, i) => (
            <div key={card.id} className="flex gap-3">
              <div className="flex w-10 shrink-0 flex-col items-center pt-1">
                <span className="font-mono text-[10px] text-[#A09F9C]">0{i + 1}</span>
                <span className="mt-1 h-full w-px bg-[#EAEAEA]" />
              </div>

              <article className="flex-1 rounded-md border border-[#EAEAEA] bg-white px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#787774]">
                  {connectionReasons?.[i] ?? 'route'}
                </p>
                <p className="mt-1 font-medium text-[#111111]">
                  {card.region}
                  <span className="ml-2 text-sm font-normal text-[#787774]">
                    {card.title}
                  </span>
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
