# GuruMeet LP

「何食べる？」を、みんなのスワイプで決める。  
GuruMeetのハッカソン発表用ランディングページです。

## Development

Node.js `>=22.13.0`

```bash
npm install
npm run dev
npm run lint
npm test
```

## Main files

- `app/layout.tsx`: SEO、OGP、Twitter Card、theme color
- `app/page.tsx`: ページエントリ
- `app/globals.css`: グローバルスタイル、端末モックアップ
- `components/landing-page.tsx`: 各セクション、コピー、画像・動画URL
- `components/phone-frame.tsx`: アプリ画面共通モックアップ
- `public/screens/`: GuruMeet実機画面
- `public/og.png`: ソーシャルプレビュー

## Replace content

`components/landing-page.tsx` 冒頭の `FOOD_IMAGES`、`APP_URL`、
`DEMO_VIDEO_URL` を本番用の値へ変更してください。GitHub URLは
`Footer` コンポーネント内にあります。
