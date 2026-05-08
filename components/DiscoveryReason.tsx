interface DiscoveryReasonProps {
  matchReason: string
  diversityNote?: string
  leftWeight: number
  rightWeight: number
}

const getWeightMessage = (weight: number) => {
  if (weight >= 3) {
    return '소멸위기 또는 매우 낮은 노출 지역이 포함되어 우선 노출되었습니다.'
  }

  if (weight === 2) {
    return '저노출 지역이 포함되어 다양성 보정이 적용되었습니다.'
  }

  return '일반 노출 배틀입니다.'
}

export default function DiscoveryReason({
  matchReason,
  diversityNote,
  leftWeight,
  rightWeight,
}: DiscoveryReasonProps) {
  const highestWeight = Math.max(leftWeight, rightWeight)
  const weightMessage = getWeightMessage(highestWeight)
  const isWeighted = highestWeight >= 2

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-cyan-400/15 text-sm">
            ⚖️
          </span>
          <h3 className="text-base font-bold text-white">
            왜 이 배틀이 추천됐을까요?
          </h3>
        </div>

        <p className="text-sm leading-6 text-white/70">{matchReason}</p>

        {diversityNote && (
          <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm leading-6 text-amber-300">
            {diversityNote}
          </p>
        )}

        <p
          className={`text-sm font-semibold leading-6 ${
            isWeighted ? 'text-cyan-300' : 'text-white/60'
          }`}
        >
          {weightMessage}
        </p>

        <p className="text-xs leading-5 text-white/50">
          승패보다 새로운 지역 발견을 더 중요하게 보기 때문에, 이 배틀은 단순 인기순으로 고른 것이 아닙니다.
        </p>
      </div>
    </section>
  )
}
