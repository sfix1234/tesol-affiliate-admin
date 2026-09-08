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

Vercelプロジェクト(Root Directory: `web`)と連携済み。`main` ブランチへの push で自動的に本番デプロイされます。

手動でデプロイする場合は `web/` ディレクトリで:

```bash
vercel        # プレビューデプロイ
vercel --prod # 本番デプロイ
```
