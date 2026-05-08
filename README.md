This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## TourAPI 데이터 파이프라인

앱은 TourAPI를 직접 호출하지 않고, `scripts/`에서 수집한 정적 JSON만 검수 대상으로 사용합니다.

1. `.env.local.example`을 복사해 `.env.local`을 만듭니다.
2. `.env.local`에 `TOUR_API_KEY`를 입력합니다.
3. `npm run fetch-tour-data`로 `scripts/tourapi-raw.json`을 생성합니다.
4. `npm run normalize-tour-data`로 `scripts/tourapi-normalized.json`을 생성합니다.
5. `tourapi-normalized.json`을 사람이 검수한 뒤 다음 단계에서 앱용 데이터를 생성합니다.

이번 파이프라인은 원본 수집과 정제까지만 담당하며, `generatedTourData.ts`는 아직 생성하지 않습니다.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
