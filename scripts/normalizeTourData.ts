import { readFileSync, writeFileSync } from 'node:fs'
import type { CultureTag, RegionScale } from '../types'

type DiversityWeight = 1 | 2 | 3

type RawTourItem = {
  contentid: string
  contenttypeid: string
  title: string
  addr1: string
  firstimage: string
  firstimage2?: string
  overview?: string
  areaCode: string
  region: string
  regionScale: RegionScale
}

type NormalizedTourItem = {
  id: string
  source: 'tourapi'
  contentId: string
  contentTypeId: string
  region: string
  regionScale: RegionScale
  title: string
  description: string
  imageUrl: string
  address: string
  tags: CultureTag[]
  diversityWeight: DiversityWeight
}

const REGION_SCALE_BY_REGION: Record<string, RegionScale> = {
  부산: 'metropolitan',
  광주: 'metropolitan',
  대전: 'metropolitan',
  전주: 'city',
  강릉: 'city',
  수원: 'city',
  청주: 'city',
  군산: 'small-city',
  목포: 'small-city',
  안산: 'small-city',
  천안: 'small-city',
  경주: 'small-city',
  담양: 'town',
  보성: 'town',
  정선: 'town',
  영월: 'town',
  남해: 'town',
}

const DIVERSITY_WEIGHT_BY_REGION: Record<string, DiversityWeight> = {
  부산: 1,
  광주: 1,
  대전: 1,
  전주: 2,
  강릉: 2,
  군산: 2,
  목포: 2,
  안산: 2,
  천안: 2,
  경주: 2,
  수원: 2,
  청주: 2,
  담양: 3,
  보성: 3,
  정선: 3,
  영월: 3,
  남해: 3,
}

const TAG_RULES: Array<{ tag: CultureTag; keywords: string[] }> = [
  { tag: '자연', keywords: ['바다', '숲', '산', '호수', '강', '해변', '공원', '해수욕', '계곡', '폭포', '생태', '자연'] },
  { tag: '음식', keywords: ['음식', '맛집', '국수', '시장', '먹거리', '카페', '빵', '막걸리', '한정식', '갈비', '비빔밥'] },
  { tag: '역사', keywords: ['유적', '역사', '근대', '박물관', '성곽', '고분', '문화재', '성지', '유물', '왕릉'] },
  { tag: '전통', keywords: ['한옥', '전통', '사찰', '민속', '아리랑', '풍물', '판소리', '한복', '서원'] },
  { tag: '예술', keywords: ['미술', '공연', '전시', '예술', '문화관', '갤러리', '뮤지엄', '조각', '창작'] },
  { tag: '시장', keywords: ['시장', '장터', '상설시장', '오일장', '야시장'] },
  { tag: '산책', keywords: ['골목', '거리', '길', '산책', '둘레길', '마을길', '올레'] },
  { tag: '야경', keywords: ['야경', '밤', '조명', '불빛', '야간'] },
  { tag: '생활문화', keywords: ['마을', '원도심', '생활', '주민', '지역민', '동네'] },
  { tag: '축제', keywords: ['축제', '행사', '제전', '페스티벌', '한마당', '대회', '이벤트'] },
]

// contentTypeId별 기본 태그: 키워드 매칭 실패 시 fallback
const CONTENT_TYPE_DEFAULT_TAG: Record<string, CultureTag> = {
  '14': '예술',   // 문화시설
  '15': '축제',   // 축제/행사
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isRawTourItem = (value: unknown): value is RawTourItem => {
  if (!isRecord(value)) return false
  return (
    typeof value.contentid === 'string' &&
    typeof value.contenttypeid === 'string' &&
    typeof value.title === 'string' &&
    typeof value.addr1 === 'string' &&
    typeof value.firstimage === 'string' &&
    typeof value.areaCode === 'string' &&
    typeof value.region === 'string' &&
    typeof value.regionScale === 'string'
  )
}

const getTags = (item: RawTourItem): CultureTag[] => {
  const text = `${item.title} ${item.addr1} ${item.overview ?? ''}`
  const matched = TAG_RULES.flatMap(rule =>
    rule.keywords.some(keyword => text.includes(keyword)) ? [rule.tag] : []
  )
  const deduplicated = [...new Set(matched)].slice(0, 3)

  // 키워드 매칭으로 태그가 없으면 contentTypeId 기반 기본 태그 부여
  if (deduplicated.length === 0) {
    const fallback: CultureTag =
      CONTENT_TYPE_DEFAULT_TAG[item.contenttypeid] ?? 'local-life'
    return [fallback]
  }

  return deduplicated
}

const truncateDescription = (overview: string) => {
  const sentences = overview
    .replace(/\s+/g, ' ')
    .split(/(?:[.!?。]\s+|다\.\s*)/)
    .filter(Boolean)
    .slice(0, 3)
    .join(' ')

  return sentences.length > 160 ? `${sentences.slice(0, 157)}...` : sentences
}

// title과 region을 반드시 포함하는 구체적인 fallback 설명 생성
const createFallbackDescription = (item: RawTourItem, tags: CultureTag[]) => {
  const location = item.addr1 ? ` ${item.addr1} 일대에서` : ''

  if (tags.includes('자연')) {
    return `${item.region} 지역에서 ${item.title}을(를) 중심으로 자연 풍경과 산책 문화를${location} 경험할 수 있는 장소입니다.`
  }
  if (tags.includes('역사')) {
    return `${item.region} 지역에서 ${item.title}을(를) 통해 역사적 흔적과 생활권의 맥락을${location} 살펴볼 수 있는 장소입니다.`
  }
  if (tags.includes('전통')) {
    return `${item.region} 지역에서 ${item.title}을(를) 중심으로 전통 문화와 지역 정체성을${location} 느낄 수 있는 장소입니다.`
  }
  if (tags.includes('예술')) {
    return `${item.region} 지역에서 ${item.title}을(를) 통해 전시와 예술 활동을${location} 만날 수 있는 문화 공간입니다.`
  }
  if (tags.includes('축제')) {
    return `${item.region} 지역에서 ${item.title}을(를) 중심으로 지역 축제와 행사 문화를${location} 경험할 수 있는 장소입니다.`
  }
  if (tags.includes('시장')) {
    return `${item.region} 지역에서 ${item.title}을(를) 통해 시장과 장터 문화를${location} 탐험할 수 있는 공간입니다.`
  }

  return `${item.region} 지역에서 ${item.title}을(를) 중심으로 지역 생활 문화와 분위기를${location} 탐험할 수 있는 장소입니다.`
}

const normalizeItem = (item: RawTourItem): NormalizedTourItem | null => {
  if (!item.firstimage || !item.title) return null

  const tags = getTags(item)
  const description = item.overview
    ? truncateDescription(item.overview)
    : createFallbackDescription(item, tags)

  return {
    id: `tour-${item.contentid}`,
    source: 'tourapi',
    contentId: item.contentid,
    contentTypeId: item.contenttypeid,
    region: item.region,
    regionScale: REGION_SCALE_BY_REGION[item.region] ?? item.regionScale,
    title: item.title,
    description,
    imageUrl: item.firstimage,
    address: item.addr1,
    tags,
    diversityWeight: DIVERSITY_WEIGHT_BY_REGION[item.region] ?? 2,
  }
}

const main = () => {
  const rawText = readFileSync('scripts/tourapi-raw.json', 'utf-8')
  const rawPayload: unknown = JSON.parse(rawText)
  const rawItems = Array.isArray(rawPayload)
    ? rawPayload.filter(isRawTourItem)
    : []

  // 중복 contentId 제거 (먼저 등장한 항목 유지)
  const seenContentIds = new Set<string>()
  const deduped = rawItems.filter(item => {
    if (seenContentIds.has(item.contentid)) return false
    seenContentIds.add(item.contentid)
    return true
  })

  const normalized = deduped
    .map(normalizeItem)
    .filter((item): item is NormalizedTourItem => item !== null)

  writeFileSync(
    'scripts/tourapi-normalized.json',
    `${JSON.stringify(normalized, null, 2)}\n`
  )

  // 지역별 개수 요약
  const byRegion: Record<string, number> = {}
  normalized.forEach(item => {
    byRegion[item.region] = (byRegion[item.region] ?? 0) + 1
  })

  console.log(`\nTourAPI normalized 데이터 ${normalized.length}개 저장 완료 → scripts/tourapi-normalized.json`)
  console.log(`(raw ${rawItems.length}개 중 중복 제거 후 ${deduped.length}개 정제)`)
  console.log('\n지역별 개수:')
  Object.entries(byRegion)
    .sort((a, b) => b[1] - a[1])
    .forEach(([region, count]) => {
      console.log(`  ${region}: ${count}개`)
    })
}

main()
