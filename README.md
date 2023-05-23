# ポケモン図鑑

このプロジェクトは、ポケモン図鑑のウェブアプリケーションです。GraphQL APIを使ってポケモンのデータを取得し、Next.jsとApollo Clientを使って表示しています。

## 機能

- ポケモン一覧表示: ポケモンのリストを表示します。各ポケモンの名前と画像が表示されます。
- ページネーション: "次へ"ボタンと"前へ"ボタンを使って、ポケモンのリストをページングすることができます。

## 使用技術

- [Next.js](https://nextjs.org/): フロントエンドフレームワーク
- [Apollo Client](https://www.apollographql.com/docs/react/): GraphQLクライアント
- [GraphQL](https://graphql.org/): データ取得のためのクエリ言語
- [TypeScript](https://www.typescriptlang.org/): JavaScriptのスーパーセット
- [Tailwind CSS](https://tailwindcss.com/): ユーティリティファーストのCSSフレームワーク
- [Docker](https://www.docker.com/): アプリケーションのコンテナ化ツール

## インストール

このプロジェクトを実行するためには、Node.jsとnpmが必要です。以下のコマンドで依存関係をインストールできます。

```sh
npm install
```

## 開発サーバーの起動

以下のコマンドで開発サーバーを起動できます。デフォルトでは http://localhost:3000 でアクセスできます。

```sh
npm run dev
```

また、Dockerを使って開発サーバーを起動することも可能です。以下のコマンドでDockerイメージをビルドし、コンテナを起動します。

```sh
docker build -t pokemon-app .
docker run -p 3000:3000 pokemon-app
```

このコマンドを実行後、ブラウザで http://localhost:3000 にアクセスするとアプリケーションが表示されます。

## ビルド

以下のコマンドでプロジェクトをビルドできます。

```sh
npm run build
```

## デプロイ

以下のコマンドでプロジェクトをデプロイできます。

```sh
npm start
```
