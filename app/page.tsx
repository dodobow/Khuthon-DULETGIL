'use client'

import { useEffect, useState } from 'react'
import BattleCard from '@/components/BattleCard'
import BattleResult from '@/components/BattleResult'
import ExplorationDashboard from '@/components/ExplorationDashboard'
import ExplorerScore from '@/components/ExplorerScore'
import RelaySection from '@/components/RelaySection'
import StorySection from '@/components/StorySection'
import { getWeightedRandomBattle, generatedBattles, extraStoryCards } from '@/data/generatedTourData'
import type { Battle, ExplorationLog, ExplorationMission, RelayCard, StoryCard } from '@/types'

type ViewMode = 'battle' | 'dashboard'

const explorationMissions: ExplorationMission[] = [
  {
    id: 'mission-town',
    title: '소멸위기 지역 탐험하기',
    description: '잘 알려지지 않은 town 규모 지역이 포함된 배틀을 끝까지 탐험해 보세요.',
    reward: 5,
  },
  {
    id: 'mission-new-region',
    title: '처음 보는 지역 발견하기',
    description: '아직 기록에 없는 새로운 지역 문화를 발견해 보세요.',
    reward: 5,
  },
  {
    id: 'mission-relay',
    title: '릴레이 콘텐츠 끝까지 확인하기',
    description: '투표 이후 릴레이와 지역 서사까지 이어서 탐험해 보세요.',
    reward: 5,
  },
  {
    id: 'mission-non-metro',
    title: '광역시 외 지역 탐험하기',
    description: '대도시 밖의 소도시와 마을 문화에 시선을 넓혀 보세요.',
    reward: 5,
  },
]

const getRandomMission = () =>
  explorationMissions[Math.floor(Math.random() * explorationMissions.length)]

// 탐험 경로의 고유 지역 순서대로 스토리 카드를 수집 (지역당 1개)
const getExplorationStoryCards = (
  battle: Battle,
  votedSide: 'left' | 'right',
  path: RelayCard[]
): StoryCard[] => {
  const exploredRegions = [
    votedSide === 'left' ? battle.leftCulture.region : battle.rightCulture.region,
    ...path.map(c => c.region),
  ]
  const uniqueRegions = [...new Set(exploredRegions)]

  const storyByRegion = new Map<string, StoryCard>()
  const allStories = [
    ...generatedBattles.flatMap(b => b.storyCards),
    ...extraStoryCards,
  ]
  for (const story of allStories) {
    if (!storyByRegion.has(story.region) && uniqueRegions.includes(story.region)) {
      storyByRegion.set(story.region, story)
    }
  }

  return uniqueRegions
    .map(region => storyByRegion.get(region))
    .filter((s): s is StoryCard => s !== undefined)
}

// 각 릴레이 카드가 어느 그룹(nearby/similar)에서 선택됐는지 기반으로 이유 계산
const computeConnectionReasons = (
  startTags: string[],
  path: RelayCard[],
  sources: ('nearby' | 'similar')[]
): string[] =>
  path.map((card, i) => {
    if (sources[i] === 'nearby') return '지역 흐름'
    const prevTags = i === 0 ? startTags : path[i - 1].tags
    const overlap = prevTags.filter(t => card.tags.includes(t))
    if (overlap.length >= 2) return `${overlap[0]} · ${overlap[1]}`
    if (overlap.length === 1) return overlap[0]
    return card.tags[0] ?? '취향'
  })

// region|title 조합 키 생성 — id가 달라도 같은 콘텐츠를 중복으로 취급
const cardKey = (card: RelayCard) => `${card.region}|${card.title}`

// 현재 배틀과 같은 regionScale의 다른 배틀 relay card를 근처 후보로 수집
const getNearbyCandiates = (
  battle: Battle,
  excludeKeys: Set<string>
): RelayCard[] => {
  const scale = battle.leftCulture.regionScale
  const seen = new Set<string>(excludeKeys)
  const result: RelayCard[] = []

  for (const b of generatedBattles) {
    if (b.id === battle.id) continue
    if (b.leftCulture.regionScale !== scale) continue
    for (const card of b.relayCards) {
      const key = cardKey(card)
      if (seen.has(key)) continue
      seen.add(key)
      result.push(card)
    }
    if (result.length >= 6) break
  }

  return result
}

// 현재 배틀 태그 기반으로 유사 취향 relay card 수집
const getSimilarTasteCandidates = (
  battle: Battle,
  excludeKeys: Set<string>
): RelayCard[] => {
  const battleTagLabels: Set<string> = new Set([
    ...battle.leftCulture.tags,
    ...battle.rightCulture.tags,
  ])

  const seen = new Set<string>(excludeKeys)
  const result: RelayCard[] = []

  for (const b of generatedBattles) {
    if (b.id === battle.id) continue
    for (const card of b.relayCards) {
      const key = cardKey(card)
      if (seen.has(key)) continue
      if (card.tags.some(tag => battleTagLabels.has(tag))) {
        seen.add(key)
        result.push(card)
      }
    }
    if (result.length >= 6) break
  }

  return result
}

const isMissionCleared = (
  mission: ExplorationMission | null,
  battle: Battle,
  selectedRelayCard: RelayCard,
  previousRegions: string[]
): boolean => {
  if (!mission) return false

  const regions = [battle.leftCulture.region, battle.rightCulture.region]
  const hasNewRegion = regions.some(region => !previousRegions.includes(region))
  const hasTown =
    battle.leftCulture.regionScale === 'town' ||
    battle.rightCulture.regionScale === 'town'
  const hasNonMetro =
    battle.leftCulture.regionScale !== 'metropolitan' ||
    battle.rightCulture.regionScale !== 'metropolitan'

  switch (mission.id) {
    case 'mission-town':
      return hasTown
    case 'mission-new-region':
      return hasNewRegion
    case 'mission-relay':
      return Boolean(selectedRelayCard)
    case 'mission-non-metro':
      return hasNonMetro
  }
}

export default function Home() {
  // 상위 화면 모드
  const [viewMode, setViewMode] = useState<ViewMode>('battle')

  // 현재 단계 (0~5)
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

  // 현재 배틀 데이터
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null)

  // 투표한 방향
  const [votedSide, setVotedSide] = useState<'left' | 'right' | null>(null)

  // 탐험 점수
  const [explorerScore, setExplorerScore] = useState(0)

  // 마지막 탐험에서 획득한 점수
  const [lastEarnedScore, setLastEarnedScore] = useState(0)

  // 발견한 지역 목록 (중복 제거)
  const [discoveredRegions, setDiscoveredRegions] = useState<string[]>([])

  // 완료한 문화 탐험 기록
  const [explorationLogs, setExplorationLogs] = useState<ExplorationLog[]>([])

  // 현재 탐험 미션
  const [currentMission, setCurrentMission] =
    useState<ExplorationMission | null>(null)

  // 방금 완료한 탐험 미션
  const [completedMission, setCompletedMission] =
    useState<ExplorationMission | null>(null)

  // 사용자가 직접 선택한 문화 연결
  const [selectedRelayCard, setSelectedRelayCard] =
    useState<RelayCard | null>(null)

  // 사용자가 현재까지 연결한 문화 탐험 루트
  const [routePath, setRoutePath] = useState<RelayCard[]>([])

  // 각 relay card를 어느 그룹에서 선택했는지 (nearby: 지역 흐름 / similar: 취향)
  const [routePathSources, setRoutePathSources] = useState<('nearby' | 'similar')[]>([])

  // 현재 문화 연결 단계
  const [routeStep, setRouteStep] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const battle = getWeightedRandomBattle()
      setCurrentBattle(battle)
      setCurrentMission(getRandomMission())
      setPhase(1)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const handleVote = (side: 'left' | 'right') => {
    setVotedSide(side)
    setPhase(2)
  }

  const handleSelectRouteCandidate = (card: RelayCard, source: 'nearby' | 'similar') => {
    if (routePath.some(route => route.id === card.id)) {
      const idx = routePath.findIndex(route => route.id === card.id)
      const nextPath = routePath.filter(route => route.id !== card.id)
      setRoutePath(nextPath)
      setRoutePathSources(prev => prev.filter((_, i) => i !== idx))
      setRouteStep(nextPath.length)
      setSelectedRelayCard(nextPath[nextPath.length - 1] ?? null)
      return
    }

    if (routePath.length >= 5) return
    setSelectedRelayCard(card)
    setRoutePath(prev => [...prev, card])
    setRoutePathSources(prev => [...prev, source])
    setRouteStep(prev => Math.min(prev + 1, 5))
  }

  // 탐험 완료 처리: 점수 추가 + 지역 추가 + 단계 전환
  const handleExploreComplete = () => {
    // currentBattle이 null이면 즉시 return (타입 가드)
    if (!currentBattle) return
    if (!votedSide) return
    if (!selectedRelayCard) return
    if (routePath.length === 0) return

    const selectedRegion =
      votedSide === 'left'
        ? currentBattle.leftCulture.region
        : currentBattle.rightCulture.region
    const selectedTitle =
      votedSide === 'left'
        ? currentBattle.leftCulture.title
        : currentBattle.rightCulture.title
    const newRegions = [selectedRegion, ...routePath.map(card => card.region)]
    const votedCulture =
      votedSide === 'left' ? currentBattle.leftCulture : currentBattle.rightCulture
    const routeConnectionReasons = computeConnectionReasons(votedCulture.tags, routePath, routePathSources)
    const clearedMission =
      isMissionCleared(
        currentMission,
        currentBattle,
        selectedRelayCard,
        discoveredRegions
      )
        ? currentMission
        : null
    const baseScore = 10
    const missionReward = clearedMission ? clearedMission.reward : 0
    const earnedScore = baseScore + missionReward

    setLastEarnedScore(earnedScore)
    setExplorerScore(prev => prev + earnedScore)
    setDiscoveredRegions(prev => [...new Set([...prev, ...newRegions])])
    setCompletedMission(clearedMission)
    setExplorationLogs(prev => [
      {
        id: `${currentBattle.id}-${Date.now()}`,
        battleTitle: `${currentBattle.leftCulture.region} vs ${currentBattle.rightCulture.region} 문화 배틀`,
        selectedRegion,
        selectedRelayTitle: selectedRelayCard.title,
        selectedRelayRegion: selectedRelayCard.region,
        selectedRelayTags: routePath.flatMap(card => card.tags),
        routePath,
        routeConnectionReasons,
        discoveredRegions: [...new Set(newRegions)],
        summary: `${selectedRegion} ${selectedTitle}에서 출발해 ${routePath.map(card => card.region).join(' → ')}로 문화 탐험 루트를 만들었어요.`,
      },
      ...prev,
    ])
    setPhase(5)
  }

  // 다음 배틀로 넘어가는 함수
  const handleNextBattle = () => {
    const next = getWeightedRandomBattle(currentBattle?.id)
    setCurrentBattle(next)
    setCurrentMission(getRandomMission())
    setCompletedMission(null)
    setSelectedRelayCard(null)
    setLastEarnedScore(0)
    setRoutePath([])
    setRoutePathSources([])
    setRouteStep(0)
    setVotedSide(null)
    setPhase(1)
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a] bg-[linear-gradient(180deg,#17172a_0%,#0f0f1a_42%,#080812_100%)] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto mb-8 flex w-full max-w-sm rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode('battle')}
            className={`min-h-12 flex-1 rounded-full px-4 text-sm font-bold transition ${
              viewMode === 'battle'
                ? 'bg-gradient-to-r from-violet-400 to-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                : 'text-white/60'
            }`}
          >
            배틀 탐험
          </button>
          <button
            type="button"
            onClick={() => setViewMode('dashboard')}
            className={`min-h-12 flex-1 rounded-full px-4 text-sm font-bold transition ${
              viewMode === 'dashboard'
                ? 'bg-gradient-to-r from-violet-400 to-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                : 'text-white/60'
            }`}
          >
            내 탐험
          </button>
        </div>

        {viewMode === 'dashboard' && (
          <div className="mx-auto max-w-xl">
            <ExplorationDashboard
              score={explorerScore}
              discoveredRegions={discoveredRegions}
              explorationLogs={explorationLogs}
              onStartExplore={() => setViewMode('battle')}
            />
          </div>
        )}

        {viewMode === 'battle' && (
          <>
            {currentBattle === null && (
              <div className="flex min-h-[70vh] items-center justify-center">
                <p className="text-center text-white/70">배틀을 불러오는 중...</p>
              </div>
            )}

            {phase === 1 && currentBattle && (
              <div className="w-full space-y-8">
                <header className="mx-auto max-w-2xl space-y-3 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                    Local Culture Battle
                  </p>
                  <h1 className="text-4xl font-black text-white sm:text-5xl">
                    문화 배틀 🗺️
                  </h1>
                  <p className="text-sm leading-6 text-white/60 sm:text-base">
                    두 지역의 문화 콘텐츠를 비교하고, 오늘 더 끌리는 여행지를 골라보세요.
                  </p>
                </header>

                <div className="mx-auto max-w-xl rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-md">
                  <p className="text-sm font-bold text-cyan-300">
                    왜 이 두 지역이 만났을까요?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {currentBattle.matchReason}
                  </p>
                </div>

                <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6">
                  <BattleCard
                    culture={currentBattle.leftCulture}
                    side="left"
                    onVote={handleVote}
                    disabled={votedSide !== null}
                  />

                  <div className="flex items-center justify-center">
                    <p className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-white/10 bg-gradient-to-br from-violet-400/25 to-cyan-400/25 text-xl font-black text-white shadow-2xl shadow-cyan-500/10 backdrop-blur-md md:size-20 md:text-2xl">
                      VS
                    </p>
                  </div>

                  <BattleCard
                    culture={currentBattle.rightCulture}
                    side="right"
                    onVote={handleVote}
                    disabled={votedSide !== null}
                  />
                </div>
              </div>
            )}

            {phase === 2 && currentBattle && votedSide !== null && (
              <div className="mx-auto max-w-xl">
                <BattleResult
                  battle={currentBattle}
                  votedSide={votedSide}
                  mission={currentMission}
                  onNext={() => setPhase(3)}
                />
              </div>
            )}

            {phase === 3 && currentBattle && (
              <div className="w-full">
                <RelaySection
                  startRegion={
                    votedSide === 'left'
                      ? currentBattle.leftCulture.region
                      : currentBattle.rightCulture.region
                  }
                  startTitle={
                    votedSide === 'left'
                      ? currentBattle.leftCulture.title
                      : currentBattle.rightCulture.title
                  }
                  routePath={routePath}
                  routeStep={routeStep}
                  nearbyCandidates={[
                    ...currentBattle.relayCards,
                    ...getNearbyCandiates(
                      currentBattle,
                      new Set(currentBattle.relayCards.map(cardKey))
                    ),
                  ].slice(0, 6)}
                  similarTasteCandidates={getSimilarTasteCandidates(
                    currentBattle,
                    new Set(currentBattle.relayCards.map(cardKey))
                  )}
                  onSelectRelay={(card, source) => handleSelectRouteCandidate(card, source)}
                  onNext={() => setPhase(4)}
                />
              </div>
            )}

            {phase === 4 && currentBattle && votedSide !== null && (
              <div className="mx-auto max-w-xl">
                <StorySection
                  storyCards={getExplorationStoryCards(currentBattle, votedSide, routePath)}
                  onNext={handleExploreComplete}
                />
              </div>
            )}

            {phase === 5 && (
              <div className="mx-auto max-w-xl">
                <ExplorerScore
                  score={explorerScore}
                  discoveredRegions={discoveredRegions}
                  explorationLogs={explorationLogs}
                  completedMission={completedMission}
                  lastEarnedScore={lastEarnedScore}
                  routePath={routePath}
                  onNext={handleNextBattle}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
