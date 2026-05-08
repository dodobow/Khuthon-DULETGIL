import RouteCandidateGroup from '@/components/RouteCandidateGroup'
import RouteProgress from '@/components/RouteProgress'
import type { RelayCard } from '@/types'

interface RelaySectionProps {
  startRegion: string
  startTitle: string
  routePath: RelayCard[]
  routeStep: number
  nearbyCandidates: RelayCard[]
  similarTasteCandidates: RelayCard[]
  onSelectRelay: (card: RelayCard, source: 'nearby' | 'similar') => void
  onNext: () => void
}

export default function RelaySection({
  startRegion,
  startTitle,
  routePath,
  routeStep,
  nearbyCandidates,
  similarTasteCandidates,
  onSelectRelay,
  onNext,
}: RelaySectionProps) {
  const isRouteReady = routePath.length > 0
  const isRouteComplete = routePath.length >= 5

  return (
    <section className="-m-6 p-6 sm:-m-10 sm:p-10 space-y-8 rounded-2xl bg-[#FFFFFF] text-[#111111] shadow-[inset_0_0_0_1px_#EAEAEA]">
      <header className="space-y-3 border-b border-[#EAEAEA] pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-[#787774]">Phase 03 · Route Construction</p>
        <h2 className="font-serif text-3xl tracking-tight text-[#111111] sm:text-4xl">답사 일정 설계</h2>
        <p className="text-sm leading-[1.6] text-[#787774] max-w-lg">
          이전 여정과 이어지는 다음 목적지를 선택하세요.<br/>
          지리적 인접성이나 문화적 유사성을 기준으로 최대 5곳의 경로를 구축할 수 있습니다.
        </p>
      </header>

      <RouteProgress
        startRegion={startRegion}
        startTitle={startTitle}
        routePath={routePath}
      />

      {isRouteComplete && (
        <div className="rounded-md border border-[#111111] bg-[#111111] p-4 text-center">
          <p className="font-sans text-sm font-medium text-white">최대 연결치(5곳)에 도달했습니다.</p>
          <p className="mt-1 text-xs text-[#A09F9C]">
            하단의 버튼을 눌러 일정을 확정하고 기록을 완성하세요.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {!isRouteComplete && (
          <div className="rounded-md border border-[#EAEAEA] bg-[#FBFBFA] p-3 text-center">
             <p className="font-mono text-xs font-medium tracking-wide text-[#111111]">
               CURRENT STEP : 0{routeStep + 1}
             </p>
          </div>
        )}

        <div className="grid items-start gap-8 md:grid-cols-2">
          <RouteCandidateGroup
            title="지리적 인접 경로"
            description="현재 위치와 가까운 지역의 문화 흐름"
            candidates={nearbyCandidates}
            routePath={routePath}
            source="nearby"
            onSelect={onSelectRelay}
          />

          <RouteCandidateGroup
            title="문화적 유사 경로"
            description="비슷한 감성이나 테마를 공유하는 공간"
            candidates={similarTasteCandidates}
            routePath={routePath}
            source="similar"
            onSelect={onSelectRelay}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!isRouteReady}
        className="group mt-8 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-md bg-[#111111] px-5 py-4 text-sm font-medium text-white transition-all hover:bg-[#2F3437] active:scale-[0.98] disabled:cursor-not-allowed disabled:border-[#EAEAEA] disabled:bg-[#FBFBFA] disabled:text-[#A09F9C]"
      >
        <span>{isRouteReady ? '루트 확정 및 기록 생성' : '목적지를 선택하여 일정을 시작하세요'}</span>
        {isRouteReady && <span className="font-mono transition-transform group-hover:translate-x-1">→</span>}
      </button>
    </section>
  )
}
