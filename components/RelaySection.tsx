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
  onSelectRelay: (card: RelayCard) => void
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
    <section className="w-full space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">문화 루트 확장하기 🗺️</h2>
        <p className="text-sm text-white/70">
          다음 문화를 어떻게 이어갈지 직접 선택해 보세요
        </p>
        <p className="text-xs leading-5 text-white/50">
          근처 지역 흐름과 유사 취향 흐름 중 원하는 방식으로 루트를 만들 수 있어요.
        </p>
      </div>

      <RouteProgress
        startRegion={startRegion}
        startTitle={startTitle}
        routePath={routePath}
      />

      {isRouteComplete && (
        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-center">
          <p className="text-lg font-bold text-white">최대 5개까지 연결했어요</p>
          <p className="mt-1 text-sm text-white/70">
            아래 버튼을 눌러야 나의 문화 탐험 루트가 완성됩니다.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <p className="rounded-2xl bg-white/10 p-3 text-center text-sm font-bold text-cyan-200">
          현재 {routeStep}번째 연결 단계입니다
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <RouteCandidateGroup
            title="근처 지역으로 이어가기"
            description="설계상 가까운 문화 흐름을 따라 이동합니다"
            candidates={nearbyCandidates}
            routePath={routePath}
            onSelect={onSelectRelay}
          />

          <RouteCandidateGroup
            title="유사 취향으로 이어가기"
            description="비슷한 감성·취향의 문화로 연결합니다"
            candidates={similarTasteCandidates}
            routePath={routePath}
            onSelect={onSelectRelay}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!isRouteReady}
        className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-400 to-cyan-400 px-5 py-4 font-bold text-white shadow-lg shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRouteReady ? '루트 완성하기' : '이어갈 문화를 먼저 선택해 주세요'}
      </button>
    </section>
  )
}
