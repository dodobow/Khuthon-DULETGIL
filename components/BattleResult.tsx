import DiscoveryReason from '@/components/DiscoveryReason'
import type { Battle } from '@/types'

interface BattleResultProps {
  battle: Battle
  votedSide: 'left' | 'right'
  onNext: () => void
}

export default function BattleResult({
  battle,
  votedSide,
  onNext,
}: BattleResultProps) {
  const selectedCulture =
    votedSide === 'left' ? battle.leftCulture : battle.rightCulture

  return (
    <section className="w-full rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-cyan-300">선택 완료</p>
          <h2 className="text-2xl font-bold text-white">
            당신은 {selectedCulture.region}을 선택했어요
          </h2>
          <p className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm leading-6 text-white/80">
            이 선택은 순위 경쟁이 아니라 문화 탐험의 출발점입니다.
          </p>
        </div>

        <DiscoveryReason
          matchReason={battle.matchReason}
          diversityNote={battle.diversityNote}
          leftWeight={battle.leftCulture.diversityWeight}
          rightWeight={battle.rightCulture.diversityWeight}
        />

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
