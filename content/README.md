# Jekyll コンテンツ (/content)

ローカルプレビュー:

1. 必要: Ruby と Bundler
2. 初回のみ: `bundle install --path vendor/bundle`
3. 起動: `bundle exec jekyll serve`

ブログは http://127.0.0.1:4000 で確認できます。

API (JSON): `/api/posts.json` に記事一覧が JSON で出力されます。

メモ:
- 本リポジトリでは Jekyll を 4.2.x に固定しています（System Ruby での `google-protobuf` 問題回避のため）。
- macOS で `google/protobuf_c` や `ffi_c` のエラーが出る場合は、以下で再インストールしてください。
  - `bundle config force_ruby_platform true`
  - `rm -rf vendor/bundle Gemfile.lock`
  - `bundle install --path vendor/bundle`
