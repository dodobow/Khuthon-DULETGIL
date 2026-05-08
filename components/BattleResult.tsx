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
    <article className="w-full rounded-xl border border-[#EAEAEA] bg-white p-8 shadow-sm sm:p-10">
      <div className="space-y-8">
        <header className="space-y-3 border-b border-[#EAEAEA] pb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#787774]">첫 답사 지점 확정</p>
          <h2 className="font-serif text-3xl tracking-tight text-[#111111] sm:text-4xl">
            {selectedCulture.region}에서 답사를 시작합니다
          </h2>
          <p className="rounded-lg border border-[#EAEAEA] bg-[#F7F6F3] p-5 text-sm leading-[1.6] text-[#2F3437]">
            이 선택은 순위 경쟁이 아니라 문화 탐험의 출발점입니다.
          </p>
        </header>

        <DiscoveryReason
          matchReason={battle.matchReason}
          diversityNote={battle.diversityNote}
          leftWeight={battle.leftCulture.diversityWeight}
          rightWeight={battle.rightCulture.diversityWeight}
        />

        <button
          type="button"
          onClick={onNext}
          className="mt-8 flex min-h-[56px] w-full items-center justify-center rounded-md bg-[#111111] px-5 py-4 text-sm font-medium text-white transition-all hover:bg-[#2F3437] active:scale-[0.98]"
        >
          답사 이어가기
        </button>
      </div>
    </article>
  )
}
