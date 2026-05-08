import { analyzeTaste } from '@/data/tasteProfile'
import type { ExplorationLog } from '@/types'

interface ExplorationDashboardProps {
  score: number
  discoveredRegions: string[]
  explorationLogs: ExplorationLog[]
  onStartExplore?: () => void
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

const badges = [
  { min: 1, label: '🗺️ 첫 탐험' },
  { min: 3, label: '🔍 탐험가' },
  { min: 5, label: '⭐ 문화 발견자' },
]

export default function ExplorationDashboard({
  score,
  discoveredRegions,
  explorationLogs,
  onStartExplore,
}: ExplorationDashboardProps) {
  const recentRoutes = explorationLogs.slice(0, 3)
  const topTags = getTopTags(explorationLogs)
  const earnedBadges = badges.filter(b => discoveredRegions.length >= b.min)
  const tasteProfile = analyzeTaste(topTags)

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-md">
      <div className="space-y-5">
        <div className="space-y-1 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Explorer Dashboard</p>
          <h3 className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-2xl font-black text-transparent">
            내 탐험 대시보드
          </h3>
        </div>

        {explorationLogs.length === 0 && (
          <div className="space-y-4 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5 text-center">
            <p className="text-lg font-bold text-white">아직 탐험 기록이 없어요</p>
            <p className="text-sm leading-6 text-white/70">배틀에 참여하고 문화를 연결하면 여기에 기록됩니다.</p>
            {onStartExplore && (
              <button type="button" onClick={onStartExplore} className="min-h-12 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20">
                배틀 탐험하러 가기
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-center">
            <p className="text-xs text-white/50">총 점수</p>
            <p className="text-2xl font-black text-cyan-200">{score}</p>
            <p className="text-xs text-white/40">EXP</p>
          </div>
          <div className="rounded-2xl border border-violet-400/30 bg-violet-400/10 p-4 text-center">
            <p className="text-xs text-white/50">발견 지역</p>
            <p className="text-2xl font-black text-violet-200">{discoveredRegions.length}</p>
            <p className="text-xs text-white/40">개</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-xs text-white/50">탐험 횟수</p>
            <p className="text-2xl font-black text-white">{explorationLogs.length}</p>
            <p className="text-xs text-white/40">회</p>
          </div>
        </div>

        {discoveredRegions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-bold text-white">발견한 지역</p>
            <div className="flex flex-wrap gap-2">
              {discoveredRegions.map(region => (
                <span key={region} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">{region}</span>
              ))}
            </div>
          </div>
        )}

        {earnedBadges.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-bold text-white">획득 배지</p>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map(badge => (
                <span key={badge.label} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200">{badge.label}</span>
              ))}
            </div>
          </div>
        )}

        {recentRoutes.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-bold text-white">내가 연결한 문화 탐험</p>
            <div className="space-y-2">
              {recentRoutes.map(route => (
                <div key={route.id} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
                  <span>{route.selectedRegion}</span>
                  {route.routePath.map((card, i) => (
                    <span key={card.id}>
                      <span className="mx-1 text-xs text-white/40">
                        → {route.routeConnectionReasons?.[i] ?? '→'}
                      </span>
                      <span>{card.region}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {tasteProfile && (
          <div className="space-y-2 rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-400/10 to-cyan-400/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">취향 분석</p>
            <p className="text-lg font-black text-white">{tasteProfile.title}</p>
            <p className="text-sm leading-6 text-white/70">{tasteProfile.description}</p>
            {topTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {topTags.map(tag => (
                  <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cyan-200">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
