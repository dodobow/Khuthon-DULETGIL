@AGENTS.md
# 프로젝트 컨텍스트

## 서비스 개요

서비스명: 지역 문화 배틀 & 탐험 플랫폼
핵심 컨셉: 사용자가 지역 문화 배틀에 투표하면서, 단순 인기 경쟁이 아니라 새로운 지역 문화를 발견하고 탐험하도록 유도하는 구조.

이 서비스는 단순한 인기 투표 앱이 아니다. 기존 SNS처럼 인기 지역만 계속 노출되는 구조를 완화하는 것이 핵심 목표다.

---

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- 상태관리: useState / useReducer만 사용
- 백엔드 없음, DB 없음, 외부 API 없음
- Mock 데이터만 사용

---

## 절대 추가 금지 기능

- 로그인 / 회원가입
- DB / API 서버
- 댓글 / 업로드 / 지도
- AI / 실시간 기능
- useCallback / useMemo 등 최적화 훅 (MVP에서 불필요)

---

## 코드 작성 원칙

- 타입 import는 반드시 import type 사용
- 컴포넌트나 값 import는 일반 import 사용
- any 타입 사용 금지
- 컴포넌트 하나당 100줄 이하
- 주석은 한국어로
- 개별 컴포넌트는 w-full 기준으로 작성, 전체 max-width 레이아웃은 page.tsx에서 처리

---

## 프로젝트 구조

```
app/
  page.tsx          # 메인 페이지 (전체 플로우 조립)
  layout.tsx
  globals.css
components/
  BattleCard.tsx    # 개별 문화 카드 + 투표 버튼
  BattleResult.tsx  # 투표 결과 + 퍼센트 바
  RelaySection.tsx  # 문화 릴레이 카드 3개
  StorySection.tsx  # 지역 서사 카드
  ExplorerScore.tsx # 탐험 점수 + 배지
data/
  mockData.ts       # Mock 데이터 + getWeightedRandomBattle 함수
types/
  index.ts          # 타입 정의
```

---

## 타입 정의 (types/index.ts)

```typescript
export type RegionScale = 'metropolitan' | 'city' | 'small-city' | 'town'

export interface Culture {
  id: string
  region: string
  title: string
  description: string
  imageUrl: string        // https://picsum.photos/seed/{encodeURIComponent(region)}/400/300
  tags: string[]
  regionScale: RegionScale
  diversityWeight: number // 1(기본) | 2(저노출) | 3(소멸위기)
}

export interface RelayCard {
  id: string
  region: string
  title: string
  description: string
  tags: string[]
  category: string
}

export interface StoryCard {
  id: string
  region: string
  content: string
  year?: string
  contributor: string
}

export interface Battle {
  id: string
  leftCulture: Culture
  rightCulture: Culture
  matchReason: string
  diversityNote?: string
  relayCards: RelayCard[]
  storyCards: StoryCard[]
}
```

---

## Mock 데이터 규칙 (data/mockData.ts)

RegionScale 분류:
- metropolitan: 서울, 부산, 대구, 인천, 광주, 대전
- city: 전주, 강릉, 수원, 창원, 청주
- small-city: 군산, 목포, 안산, 천안, 경주
- town: 담양, 보성, 정선, 영월, 남해

매칭 규칙:
- leftCulture와 rightCulture의 regionScale은 반드시 동일
- 같은 지역끼리 매칭 금지

diversityWeight 규칙:
- 전체 10개 Culture 중 weight 2 이상이 6개 이상이어야 함

imageUrl:
- 파일 내부 helper 함수 img() 사용, export 하지 않음
- `const img = (region: string) => \`https://picsum.photos/seed/${encodeURIComponent(region)}/400/300\``

getWeightedRandomBattle 함수:
- excludeId로 현재 배틀 제외
- 후보가 없으면 전체 battles에서 선택 (엣지케이스 대응)
- diversityWeight 높을수록 선택 확률 높음

---

## 디자인 시스템

배경: #0f0f1a
카드: bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl
강조색: violet-400 ~ cyan-400 그라디언트
텍스트: text-white / text-white/70 / text-white/50
버튼: 최소 높이 56px
태그: bg-white/10 text-white/80 rounded-full px-3 py-1 text-sm
전체 레이아웃: max-w-sm mx-auto px-4 py-8

---

## 사용자 플로우 (page.tsx)

```
단계 0: 마운트 시 getWeightedRandomBattle() 호출 → 단계 1로
단계 1: BattleCard 2개 표시 → 투표 시 단계 2로
단계 2: BattleResult 표시 → "탐험 계속하기" 클릭 시 단계 3으로
단계 3: RelaySection 표시 → "지역 이야기 보기" 클릭 시 단계 4로
단계 4: StorySection 표시 → "탐험 완료" 클릭 시 단계 5로
단계 5: ExplorerScore 표시 → "다음 배틀" 클릭 시 단계 0으로
```

상태 변수 (변경 금지):
```typescript
const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)
const [currentBattle, setCurrentBattle] = useState<Battle | null>(null)
const [votedSide, setVotedSide] = useState<'left' | 'right' | null>(null)
const [explorerScore, setExplorerScore] = useState(0)
const [discoveredRegions, setDiscoveredRegions] = useState<string[]>([])
```

주요 함수 규칙:
- handleExploreComplete: 내부에서 if (!currentBattle) return 가드 필수
- handleNextBattle: getWeightedRandomBattle(currentBattle?.id) 로 다음 배틀 선택
- 조건부 렌더링은 switch문 대신 phase === N && ... 방식 사용
- phase 2 렌더링: votedSide !== null 조건 명시

---

## 완료된 작업

- [x] Step 0: Next.js 초기 세팅
- [x] Step 1: 타입 정의 + Mock 데이터
- [x] Step 2: 컴포넌트 5개
- [x] Step 3: page.tsx 메인 플로우

## 현재 상태

모든 Step 완료. lint + build 통과 상태.