import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '문화 배틀',
  description: '지역 문화 배틀 & 탐험 플랫폼',
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
