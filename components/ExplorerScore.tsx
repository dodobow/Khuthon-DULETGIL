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
    <section className="w-full rounded-xl border border-[#DDD8CF] bg-[#FCFBF8] p-8 shadow-[0_18px_40px_rgba(17,17,17,0.05)] sm:p-10">
      <div className="space-y-8">
        <header className="grid gap-6 border-b border-[#E3DED6] pb-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#8A8378]">
              Phase 05 · field journal
            </p>
            <h2 className="max-w-lg font-serif text-3xl tracking-tight text-[#111111] sm:text-4xl">
              오늘의 답사가 한 페이지로 정리되었습니다
            </h2>
            <p className="max-w-xl text-sm leading-[1.7] text-[#625C53]">
              점수와 경로보다, 어떤 지역을 어떻게 이어 보았는지에 집중한 기록입니다.
            </p>
          </div>

          <div className="rounded-lg border border-[#E3DED6] bg-white p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
              record score
            </p>
            <div className="mt-2 flex items-end gap-3">
              <p className="font-mono text-5xl leading-none tracking-[-0.04em] text-[#111111] [font-variant-numeric:tabular-nums]">
                {score}
              </p>
              {lastEarnedScore > 0 && (
                <span className="mb-1 rounded-md border border-[#E3DED6] bg-[#F7F3EC] px-2 py-1 font-mono text-xs text-[#625C53]">
                  +{lastEarnedScore}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <section className="rounded-lg border border-[#E3DED6] bg-[#F7F3EC] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
                visited regions
              </p>
              <p className="mt-3 text-sm leading-[1.7] text-[#4F4A43]">
                이번까지 확인한 지역은 {discoveredRegions.length}곳입니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {discoveredRegions.map(region => (
                  <span
                    key={region}
                    className="rounded-md border border-[#DDD8CF] bg-[#FCFBF8] px-3 py-1.5 text-xs text-[#625C53]"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </section>

            {earnedBadges.length > 0 && (
              <section className="rounded-lg border border-[#E3DED6] bg-[#FCFBF8] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8378]">
                  stamp sheet
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

          <div className="space-y-4">
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
              className="flex min-h-[56px] w-full items-center justify-center rounded-md bg-[#111111] px-5 py-4 text-sm font-medium text-white transition-all hover:bg-[#2F3437] active:scale-[0.98]"
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
