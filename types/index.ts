// 지역 규모 분류
export type RegionScale = 'metropolitan' | 'city' | 'small-city' | 'town'

export type CultureTag =
  | 'nature'
  | 'food'
  | 'history'
  | 'tradition'
  | 'art'
  | 'market'
  | 'walk'
  | 'night'
  | 'local-life'
  | 'festival'

export const cultureTagLabels = {
  nature: '자연',
  food: '음식',
  history: '역사',
  tradition: '전통',
  art: '예술',
  market: '시장',
  walk: '산책',
  night: '야경',
  'local-life': '생활문화',
  festival: '축제',
} as const

// 개별 문화 콘텐츠
export interface Culture {
  id: string
  region: string          // 예: "전주"
  title: string           // 예: "한옥마을 야경"
  description: string     // 2~3문장 설명
  imageUrl: string        // picsum URL (encodeURIComponent 적용된 string)
  tags: CultureTag[]      // 예: ['tradition', 'night', 'walk']
  regionScale: RegionScale
  diversityWeight: number // 1(기본) | 2(저노출 지역) | 3(소멸위기 지역)
}

// 문화 릴레이 카드
export interface RelayCard {
  id: string
  region: string
  title: string
  description: string
  imageUrl?: string       // TourAPI 실제 이미지 URL (없으면 region 기반 fallback)
  tags: string[]
  category: string        // 예: "공연" | "음식" | "거리" | "전통" | "자연"
}

// 지역 서사 카드
export interface StoryCard {
  id: string
  region: string
  content: string         // 예: "이 골목에서 예전에 버스킹 자주 열렸어요"
  year?: string           // 예: "2019년경"
  contributor: string     // 예: "전주 토박이" (익명)
}

// 배틀 데이터
export interface Battle {
  id: string
  leftCulture: Culture
  rightCulture: Culture
  matchReason: string     // 예: "비슷한 규모의 전통문화 도시끼리 매칭되었습니다"
  diversityNote?: string  // 다양성 가중치 적용 시 표시할 문구
  relayCards: RelayCard[]
  storyCards: StoryCard[]
}

export type ExplorationMissionId =
  | 'mission-town'
  | 'mission-new-region'
  | 'mission-relay'
  | 'mission-non-metro'

export interface ExplorationMission {
  id: ExplorationMissionId
  title: string
  description: string
  reward: number
}

export interface ExplorationLog {
  id: string
  battleTitle: string
  selectedRegion: string
  selectedRelayTitle: string
  selectedRelayRegion: string
  selectedRelayTags: string[]
  routePath: RelayCard[]
  discoveredRegions: string[]
  summary: string
}
