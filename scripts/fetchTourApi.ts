import { existsSync, readFileSync, writeFileSync } from 'node:fs'

type RegionScale = 'metropolitan' | 'city' | 'small-city' | 'town'

type RegionTarget = {
  region: string
  areaCode: string
  regionScale: RegionScale
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
  { region: '부산', areaCode: '6', regionScale: 'metropolitan' },
  { region: '광주', areaCode: '5', regionScale: 'metropolitan' },
  { region: '대전', areaCode: '3', regionScale: 'metropolitan' },
  { region: '전주', areaCode: '37', regionScale: 'city' },
  { region: '강릉', areaCode: '32', regionScale: 'city' },
  { region: '수원', areaCode: '31', regionScale: 'city' },
  { region: '청주', areaCode: '33', regionScale: 'city' },
  { region: '군산', areaCode: '37', regionScale: 'small-city' },
  { region: '목포', areaCode: '38', regionScale: 'small-city' },
  { region: '안산', areaCode: '31', regionScale: 'small-city' },
  { region: '천안', areaCode: '34', regionScale: 'small-city' },
  { region: '경주', areaCode: '35', regionScale: 'small-city' },
  { region: '담양', areaCode: '38', regionScale: 'town' },
  { region: '보성', areaCode: '38', regionScale: 'town' },
  { region: '정선', areaCode: '32', regionScale: 'town' },
  { region: '영월', areaCode: '32', regionScale: 'town' },
  { region: '남해', areaCode: '36', regionScale: 'town' },
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
  const items = 'items' in body ? body.items : undefined
  if (!items || typeof items !== 'object') return []
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

const fetchContent = async (
  serviceKey: string,
  target: RegionTarget,
  contentTypeId: string
): Promise<RawTourItem[]> => {
  const url = new URL(`${API_BASE_URL}/areaBasedList2`)
  url.searchParams.set('serviceKey', serviceKey)
  url.searchParams.set('areaCode', target.areaCode)
  url.searchParams.set('contentTypeId', contentTypeId)
  url.searchParams.set('numOfRows', '10')
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('MobileApp', 'hackathon')
  url.searchParams.set('MobileOS', 'ETC')
  url.searchParams.set('_type', 'json')

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${target.region} ${contentTypeId} 수집 실패: ${response.status}`)
  }

  const payload: unknown = await response.json()
  const items = getItems(payload)

  return items.flatMap(item => {
    const title = getString(item, 'title')
    const addr1 = getString(item, 'addr1')
    const firstimage = getString(item, 'firstimage')
    const text = `${title} ${addr1}`

    if (!title || !addr1 || !firstimage) return []
    if (!text.includes(target.region)) return []

    return [{
      contentid: getString(item, 'contentid'),
      contenttypeid: getString(item, 'contenttypeid') || contentTypeId,
      title,
      addr1,
      firstimage,
      firstimage2: getString(item, 'firstimage2'),
      overview: getString(item, 'overview'),
      areaCode: target.areaCode,
      region: target.region,
      regionScale: target.regionScale,
    }]
  })
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
  console.log(`TourAPI raw 데이터 ${rawItems.length}개 저장 완료`)
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
