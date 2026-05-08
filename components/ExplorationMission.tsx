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
    <section className="rounded-lg border border-[#EAEAEA] bg-[#FBFBFA] p-5">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#787774]">
              {completed ? 'mission archived' : 'today note'}
            </p>
            <h3 className="font-serif text-xl tracking-tight text-[#111111]">
              {title}
            </h3>
          </div>
          <span className="rounded-md border border-[#EAEAEA] bg-white px-2.5 py-1 font-mono text-xs text-[#111111]">
            +{reward}
          </span>
        </div>

        <p className="max-w-[34rem] text-sm leading-[1.7] text-[#787774]">
          {description}
        </p>
      </div>
    </section>
  )
}
