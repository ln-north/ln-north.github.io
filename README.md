# ln-blog Monorepo

リポジトリ直下に Jekyll の `/content` と Next.js の `/web` をまとめたモノレポ構成です。

公開は GitHub Pages（Next.js の静的書き出し）で行います。

## 記事追加手順

- `/content/_posts` に `YYYY-MM-DD-your-slug.md` を追加
  - 例: `2025-01-01-hello.md`
  - 可能ならフロントマターに `title`, `date`, `tags`, `excerpt` を入れてください
- コミットして `main` に push
- GitHub Actions が `web` をビルドして `web/out` を Pages にデプロイします

## ローカル確認

### Jekyll (/content)

1. Ruby と Bundler を準備
2. 初回のみ: `cd content && bundle install`
3. 起動: `bundle exec jekyll serve`
4. ブラウザ: http://127.0.0.1:4000

API (JSON) は `http://127.0.0.1:4000/api/posts.json` で参照できます。

### Next.js (/web)

1. Node.js 20 系を準備
2. 依存インストール: `cd web && npm install`
3. 開発サーバ: `npm run dev`
4. ブラウザ: http://localhost:3000

Next.js はビルド時に `/content/_posts` の Markdown を読み込み、
トップページで記事一覧、`/[slug]` で記事詳細を静的生成します。

## GitHub Pages 設定

- `web/next.config.mjs` は `GITHUB_PAGES=true` のとき `basePath` / `assetPrefix` を
  `/${リポジトリ名}` に自動設定します（`GITHUB_REPOSITORY` 環境変数から取得）。
- `npm run build` は `out/` に静的書き出し（export）します。
- `.github/workflows/pages.yml` は `main` への push で `web` をビルドしてデプロイします。

## 構成

- `/content`: Jekyll（`jekyll`, `jekyll-feed`）
  - `_posts/` サンプル記事
  - `api/posts.json`: 記事の JSON 出力（title, slug, date, tags, excerpt）
- `/web`: Next.js + TypeScript + ESLint（pages ルータ）
  - Markdown を `/content/_posts` から読み込み、静的生成

