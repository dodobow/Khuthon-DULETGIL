import CultureRoute from '@/components/CultureRoute'
import ExplorationMission from '@/components/ExplorationMission'
import ExplorationLogList from '@/components/ExplorationLog'
import type { ExplorationLog, ExplorationMission as Mission, RelayCard } from '@/types'

interface ExplorerScoreProps {
  score: number
  discoveredRegions: string[]
  explorationLogs: ExplorationLog[]
  completedMission: Mission | null
  lastEarnedScore: number
  routePath: RelayCard[]
  onNext: () => void
}

const stamps = [
  { min: 1, label: '첫 기록' },
  { min: 3, label: '골목 취향' },
  { min: 5, label: '지역 수집' },
]

export default function ExplorerScore({
  score,
  discoveredRegions,
  explorationLogs,
  completedMission,
  lastEarnedScore,
  routePath,
  onNext,
}: ExplorerScoreProps) {
  const earnedBadges = stamps.filter(badge => discoveredRegions.length >= badge.min)
  const latestLog = explorationLogs[0]

  return (
    <section className="w-full rounded-xl border border-[#DDD8CF] bg-[#FCFBF8] p-6 shadow-[0_18px_40px_rgba(17,17,17,0.05)] sm:p-8">
      <div className="space-y-6">

        {/* 헤더: 라벨 + 점수 인라인 */}
        <header className="border-b border-[#E3DED6] pb-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#8A8378]">
              Phase 05 · field journal
            </p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl leading-none tracking-tight text-[#111111] [font-variant-numeric:tabular-nums]">
                {score}
              </span>
              {lastEarnedScore > 0 && (
                <span className="rounded border border-[#E3DED6] bg-[#F7F3EC] px-2 py-0.5 font-mono text-xs text-[#625C53]">
                  +{lastEarnedScore}
                </span>
              )}
            </div>
          </div>
          <h2 className="font-serif text-2xl tracking-tight text-[#111111] sm:text-3xl">
            오늘의 답사가 한 페이지로 정리되었습니다
          </h2>
          <p className="mt-2 text-sm leading-[1.7] text-[#625C53]">
            점수와 경로보다, 어떤 지역을 어떻게 이어 보았는지에 집중한 기록입니다.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {/* 왼쪽: 지역·스탬프·미션 */}
          <div className="space-y-3">
            <section className="rounded-lg border border-[#E3DED6] bg-[#F7F3EC] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
                visited regions
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {discoveredRegions.map(region => (
                  <span
                    key={region}
                    className="rounded border border-[#DDD8CF] bg-[#FCFBF8] px-2.5 py-1 text-xs text-[#625C53]"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </section>

            {earnedBadges.length > 0 && (
              <section className="rounded-lg border border-[#E3DED6] bg-[#FCFBF8] p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
                  stamp sheet
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {earnedBadges.map(badge => (
                    <span
                      key={badge.label}
                      className="rounded border border-[#C9B89A] bg-[#FBF6EA] px-2.5 py-1 text-xs font-medium tracking-wide text-[#6D5430]"
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {completedMission && (
              <ExplorationMission
                title={completedMission.title}
                description={completedMission.description}
                reward={completedMission.reward}
                completed
              />
            )}
          </div>

          {/* 오른쪽: 루트 + 버튼 */}
          <div className="flex flex-col gap-3">
            {latestLog && (
              <CultureRoute
                selectedRegion={latestLog.selectedRegion}
                routePath={routePath.length > 0 ? routePath : latestLog.routePath}
                connectionReasons={latestLog.routeConnectionReasons}
              />
            )}

            <button
              type="button"
              onClick={onNext}
              className="mt-auto flex min-h-[48px] w-full items-center justify-center rounded-md bg-[#111111] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#2F3437] active:scale-[0.98]"
            >
              다음 배틀 이어보기
            </button>
          </div>
        </div>

        <ExplorationLogList logs={explorationLogs} />
      </div>
    </section>
  )
}
