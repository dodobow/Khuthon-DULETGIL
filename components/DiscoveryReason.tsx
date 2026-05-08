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
    <section className="rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-6 items-center justify-center rounded border border-[#EAEAEA] bg-white font-mono text-xs font-bold text-[#111111]">
          i
        </span>
        <h3 className="text-sm font-bold text-[#111111]">
            왜 이 배틀이 추천됐을까요?
          </h3>
        </div>

      <div className="space-y-4">
        <p className="text-sm leading-[1.6] text-[#2F3437]">{matchReason}</p>

        {diversityNote && (
          <div className="rounded-md border border-[#FDEBEC] bg-[#FDEBEC]/30 p-4">
            <p className="text-sm leading-[1.6] text-[#9F2F2D]">{diversityNote}</p>
          </div>
        )}

        {!diversityNote && (
          <p
            className={`text-sm font-medium leading-[1.6] ${
              isWeighted ? 'text-[#1F6C9F]' : 'text-[#787774]'
            }`}
          >
            {weightMessage}
          </p>
        )}

        <p className="border-t border-[#EAEAEA] pt-4 text-xs leading-[1.6] text-[#787774]">
          * 승패보다 새로운 지역 발견을 더 중요하게 보기 때문에, 단순 인기순 추천이 아닙니다.
        </p>
      </div>
    </section>
  )
}
