'use client'

import { useEffect, useState } from 'react'
import BattleCard from '@/components/BattleCard'
import BattleResult from '@/components/BattleResult'
import ExplorerScore from '@/components/ExplorerScore'
import RelaySection from '@/components/RelaySection'
import StorySection from '@/components/StorySection'
import { getWeightedRandomBattle } from '@/data/mockData'
import type { Battle } from '@/types'

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

  useEffect(() => {
    const battle = getWeightedRandomBattle()
    // 요구사항에 따라 최초 마운트 시 배틀을 선택하고 즉시 1단계로 전환한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentBattle(battle)
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

    setExplorerScore(prev => prev + 10)

    const newRegions = [
      currentBattle.leftCulture.region,
      currentBattle.rightCulture.region,
    ]

    setDiscoveredRegions(prev => [...new Set([...prev, ...newRegions])])
    setPhase(5)
  }

  // 다음 배틀로 넘어가는 함수
  const handleNextBattle = () => {
    const next = getWeightedRandomBattle(currentBattle?.id)
    setCurrentBattle(next)
    setVotedSide(null)
    setPhase(1)
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a] text-white">
      <div className="mx-auto max-w-sm px-4 py-8">
        {currentBattle === null && (
          <p className="text-center text-white/70">배틀을 불러오는 중...</p>
        )}

        {phase === 1 && currentBattle && (
          <div className="w-full space-y-6">
            <header className="space-y-2 text-center">
              <h1 className="text-3xl font-black text-white">
                문화 배틀 🗺️
              </h1>
              <p className="text-sm text-white/50">
                마음이 가는 지역 문화에 투표해 보세요
              </p>
            </header>

            <BattleCard
              culture={currentBattle.leftCulture}
              side="left"
              onVote={handleVote}
              disabled={votedSide !== null}
            />

            <p className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-center text-2xl font-black text-transparent">
              VS
            </p>

            <BattleCard
              culture={currentBattle.rightCulture}
              side="right"
              onVote={handleVote}
              disabled={votedSide !== null}
            />
          </div>
        )}

        {phase === 2 && currentBattle && votedSide !== null && (
          <BattleResult
            battle={currentBattle}
            votedSide={votedSide}
            onNext={() => setPhase(3)}
          />
        )}

        {phase === 3 && currentBattle && (
          <RelaySection
            relayCards={currentBattle.relayCards}
            onNext={() => setPhase(4)}
          />
        )}

        {phase === 4 && currentBattle && (
          <StorySection
            storyCards={currentBattle.storyCards}
            onNext={handleExploreComplete}
          />
        )}

        {phase === 5 && (
          <ExplorerScore
            score={explorerScore}
            discoveredRegions={discoveredRegions}
            onNext={handleNextBattle}
          />
        )}
      </div>
    </main>
  )
}
