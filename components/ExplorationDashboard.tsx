import ExplorationMission from '@/components/ExplorationMission'
import { analyzeTaste } from '@/data/tasteProfile'
import type { ExplorationLog, ExplorationMission as Mission } from '@/types'

interface ExplorationDashboardProps {
  score: number
  discoveredRegions: string[]
  explorationLogs: ExplorationLog[]
  currentMission?: Mission | null
  onStartExplore?: () => void
}

const stamps = [
  { min: 1, label: '첫 기록' },
  { min: 3, label: '골목 취향' },
  { min: 5, label: '지역 수집' },
]

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
  currentMission,
  onStartExplore,
}: ExplorationDashboardProps) {
  const recentRoutes = explorationLogs.slice(0, 3)
  const topTags = getTopTags(explorationLogs)
  const earnedBadges = stamps.filter(b => discoveredRegions.length >= b.min)
  const tasteProfile = analyzeTaste(topTags)

  return (
    <section className="rounded-xl border border-[#DDD8CF] bg-[#FCFBF8] p-8 shadow-[0_18px_40px_rgba(17,17,17,0.05)] sm:p-10">
      <div className="space-y-8">
        <header className="space-y-3 border-b border-[#E3DED6] pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#8A8378]">
            personal field journal
          </p>
          <h2 className="max-w-lg font-serif text-3xl tracking-tight text-[#111111] sm:text-4xl">
            지금까지 모인 지역 기록
          </h2>
          <p className="max-w-xl text-sm leading-[1.7] text-[#625C53]">
            점수, 지역, 최근 경로, 자주 고른 분위기를 한 권의 기록장처럼 모아 둔 화면입니다.
          </p>
        </header>

        {currentMission && <ExplorationMission {...currentMission} />}

        {explorationLogs.length === 0 ? (
          <section className="rounded-lg border border-[#E3DED6] bg-[#F7F3EC] p-6">
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
                first page
              </p>
              <h3 className="font-serif text-2xl tracking-tight text-[#111111]">
                아직 기록된 답사가 없습니다
              </h3>
              <p className="max-w-[34rem] text-sm leading-[1.7] text-[#625C53]">
                배틀에 참여해 지역을 고르고, 다음 장소까지 이어 보시면 이곳에 기록이 차곡차곡 쌓입니다.
              </p>
              {onStartExplore && (
                <button
                  type="button"
                  onClick={onStartExplore}
                  className="mt-2 inline-flex min-h-[48px] items-center justify-center rounded-md bg-[#111111] px-4 py-3 text-sm font-medium text-white transition-all hover:bg-[#2F3437] active:scale-[0.98]"
                >
                  첫 기록 시작하기
                </button>
              )}
            </div>
          </section>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-lg border border-[#E3DED6] bg-[#F7F3EC] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
                  archive index
                </p>
                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <p className="font-mono text-6xl leading-none tracking-[-0.05em] text-[#111111] [font-variant-numeric:tabular-nums]">
                    {score}
                  </p>
                  <div className="space-y-1 pb-1 text-sm text-[#625C53]">
                    <p>문화 다양성 점수</p>
                    <p>{discoveredRegions.length}개 지역 · {explorationLogs.length}회 기록</p>
                  </div>
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                <section className="rounded-lg border border-[#E3DED6] bg-[#FCFBF8] p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
                    stamp drawer
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {earnedBadges.map(badge => (
                      <span
                        key={badge.label}
                        className="rounded-md border border-[#C9B89A] bg-[#FBF6EA] px-3 py-1.5 text-xs font-medium tracking-wide text-[#6D5430]"
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-[#E3DED6] bg-[#FCFBF8] p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
                    visited regions
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {discoveredRegions.map(region => (
                      <span
                        key={region}
                        className="rounded-md border border-[#DDD8CF] bg-white px-3 py-1.5 text-xs text-[#625C53]"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_0.95fr]">
              <section className="rounded-lg border border-[#E3DED6] bg-[#FCFBF8] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
                  recent routes
                </p>
                <div className="mt-4 space-y-3">
                  {recentRoutes.map(route => (
                    <article
                      key={route.id}
                      className="rounded-md border border-[#E3DED6] bg-white px-4 py-3"
                    >
                      <p className="font-medium text-[#111111]">
                        {route.selectedRegion}
                        {route.routePath.map(card => ` → ${card.region}`).join('')}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              {tasteProfile && (
                <section className="rounded-lg border border-[#D8D0E8] bg-[#F5F1FB] p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7F6AA6]">
                    curator note
                  </p>
                  <h3 className="mt-4 font-serif text-2xl tracking-tight text-[#111111]">
                    {tasteProfile.title}
                  </h3>
                  <p className="mt-3 max-w-[32rem] text-sm leading-[1.8] text-[#564C68]">
                    {tasteProfile.description}
                  </p>
                  {topTags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {topTags.map(tag => (
                        <span
                          key={tag}
                          className="rounded-md border border-[#D8D0E8] bg-white px-2.5 py-1 text-xs text-[#7F6AA6]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
