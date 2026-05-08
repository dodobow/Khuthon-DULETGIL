import type { Battle } from '@/types'

// 내부 전용 helper: 한글 seed 인코딩 처리
const img = (region: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(region)}/400/300`

export const battles: Battle[] = [
  {
    id: 'battle-city-jeonju-gangneung',
    leftCulture: {
      id: 'culture-jeonju-hanok-night',
      region: '전주',
      title: '한옥마을 야경 산책',
      description: '전주 한옥마을은 낮에는 전통 한옥의 선을, 밤에는 조명이 켜진 골목의 분위기를 즐길 수 있는 곳입니다. 경기전 주변을 따라 천천히 걷다 보면 오래된 도시의 결이 자연스럽게 드러납니다.',
      imageUrl: img('전주'),
      tags: ['전통', '야경', '도보여행'],
      regionScale: 'city',
      diversityWeight: 1,
    },
    rightCulture: {
      id: 'culture-gangneung-coffee-street',
      region: '강릉',
      title: '안목해변 커피 거리',
      description: '강릉 안목해변은 바다를 바라보며 커피를 마시는 여행 문화가 자리 잡은 공간입니다. 해안선을 따라 이어진 카페와 산책로가 도시의 여유로운 인상을 만듭니다.',
      imageUrl: img('강릉'),
      tags: ['바다', '카페', '산책'],
      regionScale: 'city',
      diversityWeight: 1,
    },
    matchReason: '비슷한 규모의 대표 여행 도시끼리 매칭되었습니다',
    relayCards: [
      {
        id: 'relay-jeonju-nambu-market',
        region: '전주',
        title: '남부시장 청년몰',
        description: '전통시장 안에 젊은 창작자들의 가게가 모여 있는 공간입니다.',
        tags: ['시장', '청년문화', '음식'],
        category: '음식',
      },
      {
        id: 'relay-gangneung-gyeongpo-lake',
        region: '강릉',
        title: '경포호 자전거길',
        description: '호수와 바다를 함께 느낄 수 있는 강릉의 대표 산책 코스입니다.',
        tags: ['호수', '자전거', '자연'],
        category: '자연',
      },
      {
        id: 'relay-jeonju-pansori',
        region: '전주',
        title: '전주 판소리 공연',
        description: '전통 소리 문화를 가까이에서 경험할 수 있는 공연 콘텐츠입니다.',
        tags: ['전통', '공연', '소리'],
        category: '공연',
      },
    ],
    storyCards: [
      {
        id: 'story-jeonju-night-walk',
        region: '전주',
        content: '한옥마을은 늦은 저녁에 사람이 조금 빠지고 나면 골목 소리가 더 잘 들려요.',
        year: '2021년경',
        contributor: '전주 토박이',
      },
      {
        id: 'story-gangneung-coffee',
        region: '강릉',
        content: '강릉 친구들은 바다 보러 간다는 말을 커피 마시러 간다는 말처럼 쓰곤 했어요.',
        contributor: '강릉 거주자',
      },
    ],
  },
  {
    id: 'battle-small-gunsan-mokpo',
    leftCulture: {
      id: 'culture-gunsan-modern-street',
      region: '군산',
      title: '근대역사 거리',
      description: '군산의 근대역사 거리는 항구 도시의 시간과 오래된 건축물이 함께 남아 있는 장소입니다. 골목마다 다른 시대의 흔적이 있어 짧은 산책만으로도 도시의 서사를 느낄 수 있습니다.',
      imageUrl: img('군산'),
      tags: ['근대문화', '골목', '역사'],
      regionScale: 'small-city',
      diversityWeight: 2,
    },
    rightCulture: {
      id: 'culture-mokpo-marine-cablecar',
      region: '목포',
      title: '해상케이블카와 원도심',
      description: '목포는 바다와 산, 원도심이 가까이 맞닿아 있는 항구 도시입니다. 해상케이블카에서 내려다보는 풍경과 오래된 거리의 생활감이 함께 어울립니다.',
      imageUrl: img('목포'),
      tags: ['항구', '원도심', '전망'],
      regionScale: 'small-city',
      diversityWeight: 2,
    },
    matchReason: '항구 도시의 역사와 원도심 문화를 가진 소도시끼리 매칭되었습니다',
    diversityNote: '두 지역 모두 최근 노출이 적어 우선 추천되었습니다',
    relayCards: [
      {
        id: 'relay-gunsan-bread',
        region: '군산',
        title: '군산 오래된 빵집 투어',
        description: '지역의 근대거리와 함께 묶어 즐기기 좋은 음식 콘텐츠입니다.',
        tags: ['빵집', '원도심', '음식'],
        category: '음식',
      },
      {
        id: 'relay-mokpo-dancing-sea',
        region: '목포',
        title: '춤추는 바다분수',
        description: '밤바다를 배경으로 음악과 조명이 어우러지는 목포의 야간 콘텐츠입니다.',
        tags: ['야경', '바다', '공연'],
        category: '공연',
      },
      {
        id: 'relay-gunsan-rail',
        region: '군산',
        title: '철길마을 산책',
        description: '낡은 철길 주변으로 생활의 흔적과 사진 명소가 이어지는 거리입니다.',
        tags: ['철길', '사진', '거리'],
        category: '거리',
      },
    ],
    storyCards: [
      {
        id: 'story-gunsan-school-trip',
        region: '군산',
        content: '근대거리 쪽은 학교 현장학습으로 자주 갔는데, 갈 때마다 새로 보이는 간판이 있었어요.',
        year: '2018년경',
        contributor: '군산 출신',
      },
      {
        id: 'story-mokpo-port',
        region: '목포',
        content: '목포역에서 조금만 걸으면 바다 냄새가 나서 여행이 시작됐다는 느낌이 났어요.',
        contributor: '목포 방문객',
      },
    ],
  },
  {
    id: 'battle-town-damyang-boseong',
    leftCulture: {
      id: 'culture-damyang-bamboo',
      region: '담양',
      title: '죽녹원 대나무 숲',
      description: '담양 죽녹원은 대나무가 만드는 그늘과 바람 소리가 인상적인 산책지입니다. 느린 걸음으로 숲길을 지나면 작은 지역이 가진 자연 문화의 힘을 느낄 수 있습니다.',
      imageUrl: img('담양'),
      tags: ['대나무', '숲길', '자연'],
      regionScale: 'town',
      diversityWeight: 2,
    },
    rightCulture: {
      id: 'culture-boseong-green-tea',
      region: '보성',
      title: '녹차밭 능선 풍경',
      description: '보성의 녹차밭은 완만한 능선을 따라 초록빛 풍경이 이어지는 지역 대표 콘텐츠입니다. 차 문화와 풍경 감상이 함께 묶여 작은 마을의 정체성을 보여 줍니다.',
      imageUrl: img('보성'),
      tags: ['녹차', '풍경', '마을여행'],
      regionScale: 'town',
      diversityWeight: 2,
    },
    matchReason: '자연 풍경과 지역 특산 문화가 뚜렷한 마을끼리 매칭되었습니다',
    diversityNote: '이 지역들은 대도시보다 노출이 적어 우선 추천되었습니다',
    relayCards: [
      {
        id: 'relay-damyang-noodle',
        region: '담양',
        title: '국수거리',
        description: '관방제림 근처에서 가볍게 들르기 좋은 담양의 음식 거리입니다.',
        tags: ['국수', '거리', '음식'],
        category: '음식',
      },
      {
        id: 'relay-boseong-tea',
        region: '보성',
        title: '차 만들기 체험',
        description: '녹차의 향과 지역 농업 문화를 함께 느낄 수 있는 체험형 콘텐츠입니다.',
        tags: ['녹차', '체험', '전통'],
        category: '전통',
      },
      {
        id: 'relay-damyang-metasequoia',
        region: '담양',
        title: '메타세쿼이아길',
        description: '곧게 뻗은 나무길이 계절마다 다른 산책 경험을 만드는 장소입니다.',
        tags: ['나무길', '사진', '자연'],
        category: '자연',
      },
    ],
    storyCards: [
      {
        id: 'story-damyang-bamboo-sound',
        region: '담양',
        content: '죽녹원은 사람이 많아도 대나무 잎 부딪히는 소리가 먼저 들릴 때가 있어요.',
        contributor: '담양 주민',
      },
      {
        id: 'story-boseong-fog',
        region: '보성',
        content: '아침 안개가 낀 녹차밭은 사진보다 실제로 보는 쪽이 훨씬 조용하고 깊어요.',
        year: '2020년경',
        contributor: '보성 여행자',
      },
    ],
  },
  {
    id: 'battle-town-jeongseon-yeongwol',
    leftCulture: {
      id: 'culture-jeongseon-arirang-market',
      region: '정선',
      title: '아리랑시장과 산골 장터',
      description: '정선 아리랑시장은 산골 지역의 장터 문화와 지역 먹거리를 함께 만날 수 있는 곳입니다. 장날의 활기와 아리랑의 지역성이 어우러져 정선만의 분위기를 만듭니다.',
      imageUrl: img('정선'),
      tags: ['장터', '아리랑', '지역음식'],
      regionScale: 'town',
      diversityWeight: 3,
    },
    rightCulture: {
      id: 'culture-yeongwol-donggang',
      region: '영월',
      title: '동강 물길과 별마로',
      description: '영월은 동강의 물길과 산세가 만드는 조용한 풍경이 강한 지역입니다. 낮에는 강을 따라 걷고 밤에는 별을 보는 여행이 자연스럽게 이어집니다.',
      imageUrl: img('영월'),
      tags: ['강', '별', '자연'],
      regionScale: 'town',
      diversityWeight: 3,
    },
    matchReason: '산과 강을 중심으로 한 강원권 마을 문화끼리 매칭되었습니다',
    diversityNote: '소멸위기 지역으로 특별히 선정되었습니다',
    relayCards: [
      {
        id: 'relay-jeongseon-railbike',
        region: '정선',
        title: '정선 레일바이크',
        description: '폐철길을 따라 산골 풍경을 가까이에서 즐기는 체험 콘텐츠입니다.',
        tags: ['레일바이크', '산골', '체험'],
        category: '자연',
      },
      {
        id: 'relay-yeongwol-observatory',
        region: '영월',
        title: '별마로천문대',
        description: '영월의 밤하늘을 대표하는 관측 명소입니다.',
        tags: ['별', '전망', '야간여행'],
        category: '자연',
      },
      {
        id: 'relay-jeongseon-arirang',
        region: '정선',
        title: '정선아리랑 공연',
        description: '지역의 소리와 이야기를 무대로 만나는 전통 공연입니다.',
        tags: ['아리랑', '전통', '공연'],
        category: '공연',
      },
    ],
    storyCards: [
      {
        id: 'story-jeongseon-market',
        region: '정선',
        content: '장날에는 관광객보다 동네 사람들이 물건 고르는 소리가 더 생생하게 남아요.',
        contributor: '정선 장터 상인',
      },
      {
        id: 'story-yeongwol-stars',
        region: '영월',
        content: '영월에서는 밤에 불빛이 적은 길로 조금만 가도 별이 훨씬 또렷하게 보여요.',
        year: '2022년경',
        contributor: '영월 거주자',
      },
    ],
  },
  {
    id: 'battle-metropolitan-busan-gwangju',
    leftCulture: {
      id: 'culture-busan-gamcheon',
      region: '부산',
      title: '감천문화마을 골목',
      description: '부산 감천문화마을은 산복도로를 따라 색색의 집과 골목이 이어지는 도시 문화 공간입니다. 항구 도시의 생활 지형과 예술적 재해석이 함께 보입니다.',
      imageUrl: img('부산'),
      tags: ['골목', '도시문화', '전망'],
      regionScale: 'metropolitan',
      diversityWeight: 1,
    },
    rightCulture: {
      id: 'culture-gwangju-asia-culture-center',
      region: '광주',
      title: '국립아시아문화전당',
      description: '광주의 국립아시아문화전당은 전시, 공연, 연구가 함께 열리는 복합 문화 공간입니다. 도심 안에서 현대 예술과 시민 문화가 만나는 장면을 만들고 있습니다.',
      imageUrl: img('광주'),
      tags: ['전시', '공연', '현대문화'],
      regionScale: 'metropolitan',
      diversityWeight: 1,
    },
    matchReason: '광역시 안에서 도시 문화와 예술 공간을 대표하는 콘텐츠끼리 매칭되었습니다',
    relayCards: [
      {
        id: 'relay-busan-bookstore',
        region: '부산',
        title: '보수동 책방골목',
        description: '오래된 책방들이 이어져 있는 부산의 생활형 문화 거리입니다.',
        tags: ['책방', '골목', '거리'],
        category: '거리',
      },
      {
        id: 'relay-gwangju-art-street',
        region: '광주',
        title: '예술의 거리',
        description: '작은 갤러리와 공방이 모여 광주의 예술 분위기를 보여 주는 거리입니다.',
        tags: ['예술', '공방', '거리'],
        category: '거리',
      },
      {
        id: 'relay-busan-night-sea',
        region: '부산',
        title: '광안리 밤바다',
        description: '다리 조명과 해변 산책이 어우러지는 부산의 대표 야경 콘텐츠입니다.',
        tags: ['야경', '바다', '산책'],
        category: '자연',
      },
    ],
    storyCards: [
      {
        id: 'story-busan-hillside',
        region: '부산',
        content: '부산 골목은 계단을 오르다 뒤돌아보는 순간 바다가 보여서 멈추게 돼요.',
        contributor: '부산 토박이',
      },
      {
        id: 'story-gwangju-performance',
        region: '광주',
        content: '문화전당 앞 광장은 전시 보러 갔다가 우연히 공연까지 보게 되는 날이 많았어요.',
        year: '2019년경',
        contributor: '광주 대학생',
      },
    ],
  },
]

// 다양성 가중치 기반 랜덤 배틀 선택
// diversityWeight가 높을수록 선택 확률이 높다
export function getWeightedRandomBattle(excludeId?: string): Battle {
  const validBattles = battles.filter(
    b => b.leftCulture.regionScale === b.rightCulture.regionScale
  )
  const source = validBattles.length > 0 ? validBattles : battles
  const filtered = source.filter(b => b.id !== excludeId)
  // 후보가 없으면 동일 규모 검증을 통과한 전체 후보에서 선택
  const candidates = filtered.length > 0 ? filtered : source

  const weights = candidates.map(b =>
    Math.max(b.leftCulture.diversityWeight, b.rightCulture.diversityWeight)
  )

  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight

  for (let i = 0; i < candidates.length; i++) {
    random -= weights[i]
    if (random <= 0) return candidates[i]
  }

  return candidates[0]
}
