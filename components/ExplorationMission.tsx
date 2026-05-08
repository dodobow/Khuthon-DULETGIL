interface ExplorationMissionProps {
  title: string
  description: string
  reward: number
  completed?: boolean
}

export default function ExplorationMission({
  title,
  description,
  reward,
  completed = false,
}: ExplorationMissionProps) {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-cyan-300">
            {completed ? '🎯 오늘의 미션 완료!' : '오늘의 탐험 미션 🎯'}
          </p>
          <span className="rounded-full bg-amber-400/10 px-3 py-1 text-sm font-bold text-amber-300">
            +{reward}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm leading-6 text-white/70">{description}</p>
        </div>

        <p className="text-xs leading-5 text-white/50">
          투표보다 탐험 행동을 보상하기 위한 미션입니다.
        </p>
      </div>
    </section>
  )
}
