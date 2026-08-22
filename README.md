# TESOL Affiliate Admin

オンラインTESOL協会のインフルエンサー向けアフィリエイト管理ツール。

- **`web/`** — Next.js (App Router / TypeScript) 実装。ダッシュボード、インフルエンサー管理、リンク発行・コンバージョン計測、精算・支払い、設定の各画面。
- **`design/`** — 画面デザインの元ファイル(Design Components / `.dc.html`)。

## ローカル開発

```bash
cd web
npm install
npm run dev
```

http://localhost:3000 で起動します。

## デプロイ

`main` ブランチへの push で GitHub Actions が `web/` を静的エクスポートし、GitHub Pages に自動デプロイします(`.github/workflows/deploy-pages.yml`)。
