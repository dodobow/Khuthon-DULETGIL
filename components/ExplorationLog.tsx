import type { ExplorationLog } from '@/types'

interface ExplorationLogProps {
  logs: ExplorationLog[]
}

export default function ExplorationLog({ logs }: ExplorationLogProps) {
  const recentLogs = logs.slice(0, 3)

  if (recentLogs.length === 0) return null

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
          recent entries
        </p>
        <h3 className="font-serif text-2xl tracking-tight text-[#111111]">
          최근에 남긴 기록
        </h3>
      </header>

      <div className="space-y-3">
        {recentLogs.map(log => (
          <article
            key={log.id}
            className="rounded-lg border border-[#E3DED6] bg-[#FCFBF8] p-5"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
                <span>{log.battleTitle}</span>
                <span>{log.selectedRegion}</span>
                <span>{log.selectedRelayRegion}</span>
              </div>

              <p className="max-w-[36rem] text-sm leading-[1.7] text-[#4F4A43]">
                {log.summary}
              </p>

              <div className="flex flex-wrap gap-2">
                {log.discoveredRegions.map(region => (
                  <span
                    key={`${log.id}-${region}`}
                    className="rounded-md border border-[#DDD8CF] bg-white px-2.5 py-1 text-xs text-[#625C53]"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
