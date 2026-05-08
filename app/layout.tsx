import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '둘렛길',
  description: '인기순이 아닌 발견의 순서로 지역 문화를 이어가는 답사 아카이브',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
