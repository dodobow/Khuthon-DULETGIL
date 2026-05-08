import type { ExplorationLog } from '@/components/ExplorationLog'

interface ExplorationDashboardProps {
  score: number
  discoveredRegions: string[]
  explorationLogs: ExplorationLog[]
}

const getTopTags = (logs: ExplorationLog[]) => {
  const tagCounts: Record<string, number> = {}

  logs.forEach(log => {
    log.selectedRelayTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag)
}

export default function ExplorationDashboard({
  score,
  discoveredRegions,
  explorationLogs,
}: ExplorationDashboardProps) {
  const recentRoutes = explorationLogs.slice(0, 3)
  const topTags = getTopTags(explorationLogs)

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-md">
      <div className="space-y-5">
        <div className="space-y-1 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            Explorer Dashboard
          </p>
          <h3 className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-2xl font-black text-transparent">
            내 탐험 대시보드
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-center">
            <p className="text-xs text-white/50">총 탐험 점수</p>
            <p className="text-3xl font-black text-cyan-200">{score} EXP</p>
          </div>
          <div className="rounded-2xl border border-violet-400/30 bg-violet-400/10 p-4 text-center">
            <p className="text-xs text-white/50">발견한 지역</p>
            <p className="text-3xl font-black text-violet-200">
              {discoveredRegions.length}개
            </p>
          </div>
        </div>

        {recentRoutes.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-white">
              내가 연결한 문화 탐험
            </p>
            <div className="space-y-2">
              {recentRoutes.map(route => (
                <div
                  key={route.id}
                  className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80"
                >
                  {route.selectedRegion} → {route.selectedRelayRegion}{' '}
                  {route.selectedRelayTitle}
                </div>
              ))}
            </div>
          </div>
        )}

        {topTags.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-white">
              당신은 이런 문화를 자주 탐험했어요
            </p>
            <div className="flex flex-wrap gap-2">
              {topTags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-cyan-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
