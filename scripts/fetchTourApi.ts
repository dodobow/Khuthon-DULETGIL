import { existsSync, readFileSync, writeFileSync } from 'node:fs'

type RegionScale = 'metropolitan' | 'city' | 'small-city' | 'town'

type RegionTarget = {
  region: string
  areaCode: string
  regionScale: RegionScale
  filterKeywords: string[]
}

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

const API_BASE_URL = 'https://apis.data.go.kr/B551011/KorService2'
const CONTENT_TYPE_IDS = ['12', '14', '15']

const REGION_TARGETS: RegionTarget[] = [
  { region: '부산', areaCode: '6', regionScale: 'metropolitan', filterKeywords: ['부산', '부산광역시'] },
  { region: '광주', areaCode: '5', regionScale: 'metropolitan', filterKeywords: ['광주', '광주광역시'] },
  { region: '대전', areaCode: '3', regionScale: 'metropolitan', filterKeywords: ['대전', '대전광역시'] },
  { region: '전주', areaCode: '37', regionScale: 'city', filterKeywords: ['전주', '전주시'] },
  { region: '강릉', areaCode: '32', regionScale: 'city', filterKeywords: ['강릉', '강릉시'] },
  { region: '수원', areaCode: '31', regionScale: 'city', filterKeywords: ['수원', '수원시'] },
  { region: '청주', areaCode: '33', regionScale: 'city', filterKeywords: ['청주', '청주시'] },
  { region: '군산', areaCode: '37', regionScale: 'small-city', filterKeywords: ['군산', '군산시'] },
  { region: '목포', areaCode: '38', regionScale: 'small-city', filterKeywords: ['목포', '목포시'] },
  { region: '안산', areaCode: '31', regionScale: 'small-city', filterKeywords: ['안산', '안산시'] },
  { region: '천안', areaCode: '34', regionScale: 'small-city', filterKeywords: ['천안', '천안시'] },
  { region: '경주', areaCode: '35', regionScale: 'small-city', filterKeywords: ['경주', '경주시'] },
  { region: '담양', areaCode: '38', regionScale: 'town', filterKeywords: ['담양', '담양군'] },
  { region: '보성', areaCode: '38', regionScale: 'town', filterKeywords: ['보성', '보성군'] },
  { region: '정선', areaCode: '32', regionScale: 'town', filterKeywords: ['정선', '정선군'] },
  { region: '영월', areaCode: '32', regionScale: 'town', filterKeywords: ['영월', '영월군'] },
  { region: '남해', areaCode: '36', regionScale: 'town', filterKeywords: ['남해', '남해군'] },
]

const loadLocalEnv = () => {
  if (!existsSync('.env.local')) return

  const lines = readFileSync('.env.local', 'utf-8').split(/\r?\n/)
  lines.forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    const [key, ...valueParts] = trimmed.split('=')
    if (!key || process.env[key]) return
    process.env[key] = valueParts.join('=')
  })
}

const getItems = (payload: unknown): Record<string, unknown>[] => {
  if (!payload || typeof payload !== 'object') return []
  const response = 'response' in payload ? payload.response : undefined
  if (!response || typeof response !== 'object') return []
  const body = 'body' in response ? response.body : undefined
  if (!body || typeof body !== 'object') return []

  // totalCount가 0이면 빈 items 처리
  const totalCount = 'totalCount' in body ? body.totalCount : undefined
  if (totalCount === 0 || totalCount === '0') return []

  const items = 'items' in body ? body.items : undefined

  // items가 빈 문자열이거나 빈 객체인 경우 처리
  if (!items || items === '' || typeof items !== 'object') return []
  const item = 'item' in items ? items.item : undefined

  if (Array.isArray(item)) return item.filter(isRecord)
  return isRecord(item) ? [item] : []
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const getString = (item: Record<string, unknown>, key: string) => {
  const value = item[key]
  return typeof value === 'string' ? value.trim() : ''
}

const normalizeServiceKey = (serviceKey: string) => {
  try {
    return decodeURIComponent(serviceKey)
  } catch {
    return serviceKey
  }
}

// title 또는 addr1에 지역 filterKeywords 중 하나라도 포함되면 통과
const matchesRegion = (title: string, addr1: string, target: RegionTarget): boolean => {
  const searchText = `${title} ${addr1}`
  return target.filterKeywords.some(keyword => searchText.includes(keyword))
}

const fetchContent = async (
  serviceKey: string,
  target: RegionTarget,
  contentTypeId: string
): Promise<RawTourItem[]> => {
  const url = new URL(`${API_BASE_URL}/areaBasedList2`)
  url.searchParams.set('serviceKey', normalizeServiceKey(serviceKey))
  url.searchParams.set('areaCode', target.areaCode)
  url.searchParams.set('contentTypeId', contentTypeId)
  url.searchParams.set('numOfRows', '20')
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('MobileApp', 'hackathon')
  url.searchParams.set('MobileOS', 'ETC')
  url.searchParams.set('_type', 'json')

  let responseText: string
  try {
    const response = await fetch(url)
    responseText = await response.text()

    if (!response.ok) {
      console.warn(`  [${target.region} / ${contentTypeId}] HTTP ${response.status}: ${responseText.slice(0, 200)}`)
      return []
    }
  } catch (err) {
    console.warn(`  [${target.region} / ${contentTypeId}] 네트워크 오류: ${err instanceof Error ? err.message : String(err)}`)
    return []
  }

  let payload: unknown
  try {
    payload = JSON.parse(responseText)
  } catch {
    // XML 오류 응답 등 JSON이 아닌 경우
    console.warn(`  [${target.region} / ${contentTypeId}] JSON 파싱 실패: ${responseText.slice(0, 200)}`)
    return []
  }

  const allItems = getItems(payload)
  const passed: RawTourItem[] = []

  for (const item of allItems) {
    const title = getString(item, 'title')
    const addr1 = getString(item, 'addr1')
    const firstimage = getString(item, 'firstimage')

    // 제목과 대표 이미지는 필수
    if (!title || !firstimage) continue

    // 지역 필터: title 또는 addr1에 filterKeywords 중 하나라도 포함되어야 함
    if (!matchesRegion(title, addr1, target)) continue

    passed.push({
      contentid: getString(item, 'contentid'),
      contenttypeid: getString(item, 'contenttypeid') || contentTypeId,
      title,
      addr1,
      firstimage,
      firstimage2: getString(item, 'firstimage2') || undefined,
      overview: getString(item, 'overview') || undefined,
      areaCode: target.areaCode,
      region: target.region,
      regionScale: target.regionScale,
    })
  }

  console.log(`  [${target.region} / ${contentTypeId}] 응답 ${allItems.length}개, 필터 통과 ${passed.length}개`)
  return passed
}

const main = async () => {
  loadLocalEnv()
  const serviceKey = process.env.TOUR_API_KEY
  if (!serviceKey) {
    throw new Error('TOUR_API_KEY가 없습니다. .env.local에 키를 입력해 주세요.')
  }

  const rawItems: RawTourItem[] = []

  for (const target of REGION_TARGETS) {
    for (const contentTypeId of CONTENT_TYPE_IDS) {
      const items = await fetchContent(serviceKey, target, contentTypeId)
      rawItems.push(...items)
    }
  }

  writeFileSync('scripts/tourapi-raw.json', `${JSON.stringify(rawItems, null, 2)}\n`)
  console.log(`\nTourAPI raw 데이터 총 ${rawItems.length}개 저장 완료 → scripts/tourapi-raw.json`)
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
