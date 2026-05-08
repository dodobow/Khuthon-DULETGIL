'use client'

import { useEffect, useState } from 'react'
import BattleCard from '@/components/BattleCard'
import BattleResult from '@/components/BattleResult'
import ExplorerScore from '@/components/ExplorerScore'
import RelaySection from '@/components/RelaySection'
import StorySection from '@/components/StorySection'
import { getWeightedRandomBattle } from '@/data/mockData'
import type { Battle, RelayCard } from '@/types'

type ExplorationLog = {
  id: string
  battleTitle: string
  selectedRegion: string
  selectedRelayTitle: string
  selectedRelayRegion: string
  selectedRelayTags: string[]
  discoveredRegions: string[]
  summary: string
}

type ExplorationMission = {
  id: string
  title: string
  description: string
  reward: number
}

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

export default function Home() {
  // 현재 단계 (0~5)
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

  // 현재 배틀 데이터
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null)

  // 투표한 방향
  const [votedSide, setVotedSide] = useState<'left' | 'right' | null>(null)

  // 탐험 점수
  const [explorerScore, setExplorerScore] = useState(0)

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

  useEffect(() => {
    const battle = getWeightedRandomBattle()
    // 요구사항에 따라 최초 마운트 시 배틀을 선택하고 즉시 1단계로 전환한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentBattle(battle)
    setCurrentMission(getRandomMission())
    setPhase(1)
  }, [])

  const handleVote = (side: 'left' | 'right') => {
    setVotedSide(side)
    setPhase(2)
  }

  // 탐험 완료 처리: 점수 추가 + 지역 추가 + 단계 전환
  const handleExploreComplete = () => {
    // currentBattle이 null이면 즉시 return (타입 가드)
    if (!currentBattle) return
    if (!votedSide) return
    if (!selectedRelayCard) return

    const newRegions = [
      currentBattle.leftCulture.region,
      currentBattle.rightCulture.region,
    ]
    const selectedRegion =
      votedSide === 'left'
        ? currentBattle.leftCulture.region
        : currentBattle.rightCulture.region
    const hasDiversityWeightThree =
      currentBattle.leftCulture.diversityWeight === 3 ||
      currentBattle.rightCulture.diversityWeight === 3
    const hasNewRegion = newRegions.some(
      region => !discoveredRegions.includes(region)
    )
    const hasSmallRegion =
      currentBattle.leftCulture.regionScale === 'small-city' ||
      currentBattle.leftCulture.regionScale === 'town' ||
      currentBattle.rightCulture.regionScale === 'small-city' ||
      currentBattle.rightCulture.regionScale === 'town'
    const clearedMission =
      currentMission && (hasDiversityWeightThree || hasNewRegion || hasSmallRegion)
        ? currentMission
        : null
    const missionReward = clearedMission ? clearedMission.reward : 0

    setExplorerScore(prev => prev + 10 + missionReward)
    setDiscoveredRegions(prev => [...new Set([...prev, ...newRegions])])
    setCompletedMission(clearedMission)
    setExplorationLogs(prev => [
      {
        id: `${currentBattle.id}-${Date.now()}`,
        battleTitle: `${currentBattle.leftCulture.region} vs ${currentBattle.rightCulture.region} 문화 배틀`,
        selectedRegion,
        selectedRelayTitle: selectedRelayCard.title,
        selectedRelayRegion: selectedRelayCard.region,
        selectedRelayTags: selectedRelayCard.tags,
        discoveredRegions: newRegions,
        summary: `${selectedRegion}을 선택한 뒤, ${selectedRelayCard.region} ${selectedRelayCard.title}로 문화 연결을 이어갔어요.`,
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
    setVotedSide(null)
    setPhase(1)
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a] bg-[linear-gradient(180deg,#17172a_0%,#0f0f1a_42%,#080812_100%)] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
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
          <div className="mx-auto max-w-xl">
            <RelaySection
              relayCards={currentBattle.relayCards}
              selectedRelayCard={selectedRelayCard}
              onSelectRelay={setSelectedRelayCard}
              onNext={() => setPhase(4)}
            />
          </div>
        )}

        {phase === 4 && currentBattle && (
          <div className="mx-auto max-w-xl">
            <StorySection
              storyCards={currentBattle.storyCards}
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
              onNext={handleNextBattle}
            />
          </div>
        )}
      </div>
    </main>
  )
}
