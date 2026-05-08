type TagGroup = 'nature' | 'history' | 'art' | 'life'

// 한국어 태그 → 그룹 매핑 (cultureTagLabels 기준)
const TAG_TO_GROUP: Record<string, TagGroup> = {
  '자연': 'nature',
  '산책': 'nature',
  '역사': 'history',
  '전통': 'history',
  '예술': 'art',
  '축제': 'art',
  '음식': 'life',
  '시장': 'life',
  '생활문화': 'life',
  '야경': 'life',
}

type TasteProfile = {
  title: string
  description: string
}

// 16가지 (primary-secondary) 조합별 취향 프로필
const PROFILES: Record<string, TasteProfile> = {
  'nature-nature': {
    title: '자연 감성 탐험가',
    description: '조용히 걷고 바라보는 여행을 즐겨. 자연 속에서 지역의 결을 읽는 취향이 강해.',
  },
  'nature-history': {
    title: '야외 헤리티지 탐험가',
    description: '자연 속에 남겨진 역사의 흔적을 따라가는 걸 좋아해. 풍경과 이야기가 함께 있는 곳에서 오래 머무는 편이야.',
  },
  'nature-art': {
    title: '감성 자연 탐험가',
    description: '아름다운 자연 배경 속에서 예술적 감성을 발견하는 타입이야. 장소 분위기를 콘텐츠만큼 중요하게 생각해.',
  },
  'nature-life': {
    title: '생활 자연 탐험가',
    description: '자연 속에서도 그 지역 사람들의 생활 감각을 함께 탐험해. 관광지보다 실제 살아있는 자연 공간을 선호하는 편이야.',
  },
  'history-nature': {
    title: '야외 역사 탐험가',
    description: '역사적 공간을 자연 속에서 천천히 걷는 방식으로 탐험해. 설명보다 직접 느끼는 걸 좋아하는 타입이야.',
  },
  'history-history': {
    title: '헤리티지형 탐험가',
    description: '지역의 역사와 전통 문화를 깊이 탐험하는 걸 좋아해. 오래된 것들 안에서 현재의 맥락을 발견하는 편이야.',
  },
  'history-art': {
    title: '문화 헤리티지 탐험가',
    description: '역사적 공간에서 열리는 예술과 공연에 끌리는 취향이야. 시간이 쌓인 장소에서 만나는 현대 문화를 즐겨.',
  },
  'history-life': {
    title: '생활사 탐험가',
    description: '역사를 박물관보다 지역 생활 속에서 발견하는 걸 좋아해. 오래된 시장과 골목에서 과거의 흔적을 찾는 타입이야.',
  },
  'art-nature': {
    title: '자연 예술 탐험가',
    description: '자연을 배경으로 한 전시, 공연, 축제를 즐기는 감성파야. 장소 자체가 예술이 되는 공간에서 오래 머물고 싶어해.',
  },
  'art-history': {
    title: '예술 헤리티지 탐험가',
    description: '역사적 장소에서 열리는 예술 콘텐츠에 특히 매력을 느끼는 타입이야. 과거와 현재가 교차하는 문화 공간을 자주 찾아.',
  },
  'art-art': {
    title: '예술형 탐험가',
    description: '전시, 공연, 축제 중심으로 지역 문화를 탐험하는 타입이야. 어느 도시든 문화 공간을 먼저 찾는 편이야.',
  },
  'art-life': {
    title: '도시 감성 탐험가',
    description: '도시의 예술 공간과 생활 문화가 섞인 동네를 좋아해. 세련된 감각과 로컬 감성이 공존하는 장소에 끌리는 타입이야.',
  },
  'life-nature': {
    title: '로컬 자연 탐험가',
    description: '자연 속에서도 그 지역만의 생활 리듬을 함께 경험하고 싶어해. 관광보다 현지인처럼 머무는 여행을 선호하는 편이야.',
  },
  'life-history': {
    title: '생활 역사 탐험가',
    description: '지역의 오래된 생활 흔적과 역사를 함께 탐험해. 시장 골목이나 원도심 같은 장소에서 이야기를 발견하는 편이야.',
  },
  'life-art': {
    title: '도시 문화 탐험가',
    description: '먹고, 보고, 즐기는 도시 문화 전반을 탐험하는 스타일이야. 어디서나 지역의 생동감 있는 현장을 찾아다녀.',
  },
  'life-life': {
    title: '로컬 생활 탐험가',
    description: '시장, 골목, 야경, 로컬 음식 등 지역의 생활 문화 그 자체를 즐겨. 화려한 관광지보다 그 지역 사람들의 일상이 더 흥미로운 타입이야.',
  },
}

export function analyzeTaste(topTags: string[]): TasteProfile | null {
  if (topTags.length === 0) return null

  // 그룹별 등장 횟수 집계
  const groupCounts: Record<TagGroup, number> = { nature: 0, history: 0, art: 0, life: 0 }
  topTags.forEach(tag => {
    const group = TAG_TO_GROUP[tag]
    if (group) groupCounts[group]++
  })

  const sorted = (Object.entries(groupCounts) as [TagGroup, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])

  if (sorted.length === 0) return null

  const primary = sorted[0][0]
  const secondary = sorted.length > 1 ? sorted[1][0] : primary
  const profile = PROFILES[`${primary}-${secondary}`]

  if (profile) return profile

  // 예외 케이스 fallback
  const labels = topTags.slice(0, 2).join(', ')
  return {
    title: '지역 문화 탐험가',
    description: `${labels} 중심의 지역 문화를 자주 탐험하는 편이야.`,
  }
}
