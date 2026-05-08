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
              onNext={() => setPhase(3)}
            />
          </div>
        )}

        {phase === 3 && currentBattle && (
          <div className="mx-auto max-w-xl">
            <RelaySection
              relayCards={currentBattle.relayCards}
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
              onNext={handleNextBattle}
            />
          </div>
        )}
      </div>
    </main>
  )
}
