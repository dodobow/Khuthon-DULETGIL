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
  { tag: 'nature', keywords: ['바다', '숲', '산', '호수', '강', '해변', '공원'] },
  { tag: 'food', keywords: ['음식', '맛집', '국수', '시장', '먹거리', '카페'] },
  { tag: 'history', keywords: ['유적', '역사', '근대', '박물관', '성곽', '고분'] },
  { tag: 'tradition', keywords: ['한옥', '전통', '사찰', '문화재', '민속', '아리랑'] },
  { tag: 'art', keywords: ['미술', '공연', '전시', '예술', '문화관', '갤러리'] },
  { tag: 'market', keywords: ['시장', '장터', '상설시장'] },
  { tag: 'walk', keywords: ['골목', '거리', '길', '산책', '둘레길', '마을'] },
  { tag: 'night', keywords: ['야경', '밤', '조명', '불빛'] },
  { tag: 'local-life', keywords: ['마을', '원도심', '생활', '골목', '거리'] },
  { tag: 'festival', keywords: ['축제', '행사', '제전', '페스티벌'] },
]

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
  const tags = TAG_RULES.flatMap(rule =>
    rule.keywords.some(keyword => text.includes(keyword)) ? [rule.tag] : []
  )

  return [...new Set(tags)].slice(0, 3)
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

const createFallbackDescription = (item: RawTourItem, tags: CultureTag[]) => {
  if (tags.includes('nature')) {
    return `${item.region} 지역의 자연 풍경과 산책 문화를 ${item.addr1} 일대에서 경험할 수 있는 장소입니다.`
  }
  if (tags.includes('history')) {
    return `${item.region} 지역의 역사적 흔적과 생활권의 맥락을 ${item.addr1}에서 살펴볼 수 있는 장소입니다.`
  }
  if (tags.includes('tradition')) {
    return `${item.region} 지역의 전통 문화와 지역 정체성을 ${item.addr1} 일대에서 느낄 수 있는 장소입니다.`
  }
  if (tags.includes('art')) {
    return `${item.region} 지역의 전시와 예술 활동을 ${item.addr1}에서 만날 수 있는 문화 공간입니다.`
  }

  return `${item.region} 지역의 생활 문화와 지역 분위기를 ${item.addr1} 일대에서 탐험할 수 있는 장소입니다.`
}

const normalizeItem = (item: RawTourItem): NormalizedTourItem | null => {
  if (!item.firstimage || !item.title || !item.addr1) return null

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

  const normalized = rawItems
    .map(normalizeItem)
    .filter((item): item is NormalizedTourItem => item !== null)

  writeFileSync(
    'scripts/tourapi-normalized.json',
    `${JSON.stringify(normalized, null, 2)}\n`
  )
  console.log(`TourAPI normalized 데이터 ${normalized.length}개 저장 완료`)
}

main()
