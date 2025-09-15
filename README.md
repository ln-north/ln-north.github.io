# ln-blog Monorepo

リポジトリ直下に Jekyll の `/content` と Next.js の `/web` をまとめたモノレポ構成です。

公開は GitHub Pages（Actions で Next.js を静的書き出し）で行います。カスタムドメインは `ln-north.net`（`www` は 301 で apex にリダイレクト）。

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
2. 依存インストール: `cd web && npm install`（初回に `web/package-lock.json` をコミット推奨）
3. 開発サーバ: `npm run dev`
4. ブラウザ: http://localhost:3000

Next.js はビルド時に `/content/_posts` の Markdown を読み込み、
トップページで記事一覧、`/[slug]` で記事詳細を静的生成します。

## GitHub Pages / カスタムドメイン

- カスタムドメイン: `ln-north.net`（`www.ln-north.net` は 301 → `https://ln-north.net/`）
- `web/next.config.mjs`
  - `CUSTOM_DOMAIN=true` のとき、`basePath` / `assetPrefix` を無効化（ユーザー/組織サイトのルート公開向け）
  - それ以外で `GITHUB_PAGES=true` かつ `GITHUB_REPOSITORY` がある場合は `/${repo}` を付与
- ビルド: `npm run build` で `web/out/` に静的書き出し
- デプロイ: `.github/workflows/pages.yml`
  - `web` を `npm ci` → `npm run build`
  - 成果物に `CNAME=ln-north.net` を含めてアップロード（UI設定と一致させるとベター）
  - `actions/deploy-pages@v4` で公開
- 注意: リポジトリ内に余分な `CNAME` は置かないでください（生成物 `web/out/CNAME` のみ）

確認コマンド（公開後）
- `curl -I https://ln-north.net`（server: GitHub.com を確認）
- `curl -I https://www.ln-north.net`（301 → https://ln-north.net/ を確認）

## 構成

- `/content`: Jekyll（`jekyll`, `jekyll-feed`）
  - `_posts/` サンプル記事
  - `api/posts.json`: 記事の JSON 出力（title, slug, date, tags, excerpt）
- `/web`: Next.js + TypeScript + ESLint（pages ルータ）
  - Markdown を `/content/_posts` から読み込み、静的生成

## トラブルシューティング（Jekyll on macOS System Ruby）

- `google-protobuf`/`ffi` 関連のエラーが出る場合:
  1) `cd content && bundle config force_ruby_platform true`
  2) `rm -rf vendor/bundle Gemfile.lock`
  3) `bundle install --path vendor/bundle`
  4) `bundle exec jekyll serve`
- 本リポジトリでは Jekyll を 4.2.x に固定し、`sass-embedded` 依存を回避しています（必要に応じて Ruby を 3.x に上げて 4.3 系へ戻すことも可能）。
