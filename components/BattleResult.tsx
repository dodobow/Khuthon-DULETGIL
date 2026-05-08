import DiscoveryReason from '@/components/DiscoveryReason'
import ExplorationMission from '@/components/ExplorationMission'
import type { Battle } from '@/types'

interface Mission {
  title: string
  description: string
  reward: number
}

interface BattleResultProps {
  battle: Battle
  votedSide: 'left' | 'right'
  mission: Mission | null
  onNext: () => void
}

export default function BattleResult({
  battle,
  votedSide,
  mission,
  onNext,
}: BattleResultProps) {
  const leftPercent = votedSide === 'left' ? 58 : 44
  const rightPercent = votedSide === 'left' ? 42 : 56
  const leadingCulture =
    leftPercent > rightPercent ? battle.leftCulture : battle.rightCulture

  return (
    <section className="w-full rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-cyan-300">
            투표 결과
          </p>
          <h2 className="text-2xl font-bold text-white">
            현재 {leadingCulture.region}이 앞서고 있어요!
          </h2>
          <p className="text-sm leading-6 text-white/70">
            {battle.matchReason}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold text-white">
            <span>{battle.leftCulture.region} {leftPercent}%</span>
            <span>{battle.rightCulture.region} {rightPercent}%</span>
          </div>
          <div className="flex h-5 overflow-hidden rounded-full bg-white/10">
            <div
              className="bg-gradient-to-r from-violet-400 to-fuchsia-400"
              style={{ width: `${leftPercent}%` }}
            />
            <div
              className="bg-gradient-to-r from-cyan-400 to-sky-400"
              style={{ width: `${rightPercent}%` }}
            />
          </div>
        </div>

        <DiscoveryReason
          matchReason={battle.matchReason}
          diversityNote={battle.diversityNote}
          leftWeight={battle.leftCulture.diversityWeight}
          rightWeight={battle.rightCulture.diversityWeight}
        />

        {mission && (
          <ExplorationMission
            title={mission.title}
            description={mission.description}
            reward={mission.reward}
          />
        )}

        <button
          type="button"
          onClick={onNext}
          className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-400 to-cyan-400 px-5 py-4 font-bold text-white shadow-lg shadow-cyan-500/20"
        >
          문화 탐험 계속하기
        </button>
      </div>
    </section>
  )
}
