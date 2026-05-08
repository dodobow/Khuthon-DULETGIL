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
    <section className="rounded-xl border border-[#DDD8CF] bg-[#FCFBF8] p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)] sm:p-8">
      <div className="space-y-6">

        <header className="space-y-2 border-b border-[#E3DED6] pb-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#8A8378]">
            personal field journal
          </p>
          <h2 className="font-serif text-2xl tracking-tight text-[#111111] sm:text-3xl">
            지금까지 모인 지역 기록
          </h2>
          <p className="text-sm leading-[1.7] text-[#625C53]">
            점수, 지역, 최근 경로, 자주 고른 분위기를 한 권의 기록장처럼 모아 둔 화면입니다.
          </p>
        </header>

        {currentMission && <ExplorationMission {...currentMission} />}

        {explorationLogs.length === 0 ? (
          <section className="rounded-lg border border-[#E3DED6] bg-[#F7F3EC] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">first page</p>
            <h3 className="mt-2 font-serif text-xl tracking-tight text-[#111111]">
              첫 답사를 시작하면 이곳에 기록이 쌓입니다
            </h3>
            <p className="mt-2 text-sm leading-[1.7] text-[#625C53]">
              지역을 고르고 루트를 이어가면, 당신만의 답사 아카이브가 여기에 차곡차곡 기록됩니다.
            </p>
            {onStartExplore && (
              <button
                type="button"
                onClick={onStartExplore}
                className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#111111] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2F3437] active:scale-[0.98]"
              >
                첫 기록 시작하기
              </button>
            )}
          </section>
        ) : (
          <>
            {/* 아카이브 인덱스: 점수·지역·스탬프 한 줄 정리 */}
            <section className="rounded-lg border border-[#E3DED6] bg-[#F7F3EC] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">archive index</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-end gap-2">
                  <span className="font-mono text-4xl leading-none tracking-tight text-[#111111] [font-variant-numeric:tabular-nums]">
                    {score}
                  </span>
                  <span className="pb-0.5 text-sm text-[#625C53]">점</span>
                </div>
                <div className="text-sm text-[#625C53]">
                  <span>{discoveredRegions.length}개 지역</span>
                  <span className="mx-2 text-[#C9B89A]">·</span>
                  <span>{explorationLogs.length}회 기록</span>
                </div>
                {earnedBadges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {earnedBadges.map(badge => (
                      <span
                        key={badge.label}
                        className="rounded border border-[#C9B89A] bg-[#FBF6EA] px-2 py-0.5 text-xs font-medium text-[#6D5430]"
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {discoveredRegions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {discoveredRegions.map(region => (
                    <span
                      key={region}
                      className="rounded border border-[#DDD8CF] bg-white px-2.5 py-1 text-xs text-[#625C53]"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              {/* 최근 루트 */}
              <section className="rounded-lg border border-[#E3DED6] bg-[#FCFBF8] p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">recent routes</p>
                <div className="mt-3 divide-y divide-[#E3DED6]">
                  {recentRoutes.map(route => (
                    <p key={route.id} className="py-2.5 text-sm font-medium text-[#111111]">
                      {route.selectedRegion}
                      {route.routePath.map((card, i) => (
                        <span key={card.id}>
                          <span className="mx-1 text-xs text-[#8A8378]">
                            → {route.routeConnectionReasons?.[i] ?? '→'}
                          </span>
                          {card.region}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </section>

              {/* 취향 분석 */}
              {tasteProfile ? (
                <section className="rounded-lg border border-[#D8D0E8] bg-[#F5F1FB] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7F6AA6]">curator note</p>
                  <h3 className="mt-2 font-serif text-xl tracking-tight text-[#111111]">
                    {tasteProfile.title}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.8] text-[#564C68]">
                    {tasteProfile.description}
                  </p>
                  {topTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {topTags.map(tag => (
                        <span
                          key={tag}
                          className="rounded border border-[#D8D0E8] bg-white px-2 py-0.5 text-xs text-[#7F6AA6]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </section>
              ) : (
                /* 취향 분석 없을 때 빈 자리 방지용 */
                <div />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
