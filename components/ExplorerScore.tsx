import CultureRoute from '@/components/CultureRoute'
import ExplorationMission from '@/components/ExplorationMission'
import ExplorationLogList from '@/components/ExplorationLog'
import type { ExplorationLog } from '@/components/ExplorationLog'

interface Mission {
  title: string
  description: string
  reward: number
}

interface ExplorerScoreProps {
  score: number
  discoveredRegions: string[]
  explorationLogs: ExplorationLog[]
  completedMission: Mission | null
  onNext: () => void
}

export default function ExplorerScore({
  score,
  discoveredRegions,
  explorationLogs,
  completedMission,
  onNext,
}: ExplorerScoreProps) {
  const badges = [
    { min: 1, label: '🗺️ 첫 탐험' },
    { min: 3, label: '🔍 탐험가' },
    { min: 5, label: '⭐ 문화 발견자' },
  ].filter(badge => discoveredRegions.length >= badge.min)
  const latestLog = explorationLogs[0]

  return (
    <section className="w-full rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
      <div className="space-y-6">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold text-white">탐험 완료! 🎉</h2>
          <div className="relative inline-flex items-center justify-center">
            <p className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-6xl font-black text-transparent">
              {score}
            </p>
            <span className="absolute -right-12 -top-3 animate-bounce text-2xl font-black text-cyan-300">
              +10
            </span>
          </div>
          <p className="text-sm text-white/70">
            {discoveredRegions.length}개 지역 발견
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {discoveredRegions.map(region => (
            <span key={region} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
              {region}
            </span>
          ))}
        </div>
        {badges.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white/70">획득 배지</p>
            <div className="flex flex-wrap justify-center gap-2">
              {badges.map(badge => (
                <span key={badge.label} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200">
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        )}
        {completedMission && (
          <ExplorationMission
            title={completedMission.title}
            description={completedMission.description}
            reward={completedMission.reward}
            completed
          />
        )}
        {latestLog && (
          <CultureRoute
            selectedRegion={latestLog.selectedRegion}
            selectedRelayRegion={latestLog.selectedRelayRegion}
            selectedRelayTitle={latestLog.selectedRelayTitle}
          />
        )}
        <ExplorationLogList logs={explorationLogs} />
        <button
          type="button"
          onClick={onNext}
          className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-400 to-cyan-400 px-5 py-4 font-bold text-white shadow-lg shadow-violet-500/20"
        >
          다음 배틀 탐험하기
        </button>
      </div>
    </section>
  )
}
