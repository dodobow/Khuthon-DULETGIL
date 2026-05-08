export type ExplorationLog = {
  id: string
  battleTitle: string
  selectedRegion: string
  selectedRelayTitle: string
  selectedRelayRegion: string
  selectedRelayTags: string[]
  discoveredRegions: string[]
  summary: string
}

interface ExplorationLogProps {
  logs: ExplorationLog[]
}

export default function ExplorationLog({ logs }: ExplorationLogProps) {
  const recentLogs = logs.slice(0, 3)

  if (recentLogs.length === 0) return null

  return (
    <div className="space-y-3 text-left">
      <div className="space-y-1 text-center">
        <h3 className="text-xl font-bold text-white">나의 문화 탐험 기록</h3>
        <p className="text-sm text-white/50">최근 탐험한 지역 문화 여정</p>
      </div>

      <div className="space-y-3">
        {recentLogs.map(log => (
          <article
            key={log.id}
            className="rounded-2xl border border-white/20 bg-white/10 p-4"
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-bold text-cyan-300">
                  {log.battleTitle}
                </p>
                <p className="text-xs text-white/50">
                  선택한 지역: {log.selectedRegion}
                </p>
                <p className="text-xs text-white/60">
                  이어간 문화: {log.selectedRelayRegion} · {log.selectedRelayTitle}
                </p>
              </div>

              <p className="text-sm leading-6 text-white/70">{log.summary}</p>

              <div className="flex flex-wrap gap-2">
                {log.discoveredRegions.map(region => (
                  <span
                    key={`${log.id}-${region}`}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
