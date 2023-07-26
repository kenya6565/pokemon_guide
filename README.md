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
- [Golang](https://golang.org/): バックエンドサービスの実装に使用
- [Docker](https://www.docker.com/): アプリケーションのコンテナ化ツール
- [Vercel](https://vercel.com/): フロントエンドのデプロイ
- [AWS Lambda](https://aws.amazon.com/lambda/): バックエンドのデプロイ
- [AWS API Gateway](https://aws.amazon.com/api-gateway/): HTTPリクエストのルーティング

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

## 本番環境

このプロジェクトは本番環境で運用されています。以下は本番環境の構築に関する情報です。

- **フロントエンド**: [Next.js](https://nextjs.org/) で作成されたフロントエンドアプリケーションは、[Vercel](https://vercel.com/) により自動的にデプロイされます。
- **バックエンド**: [Golang](https://golang.org/) で作成されたGraphQLサーバーは、[AWS Lambda](https://aws.amazon.com/lambda/) を使用してデプロイされます。 AWS Lambdaのセットアップとデプロイは、AWSのマネージメントコンソールを通じて手動で行われます。
- **通信**: バックエンドとフロントエンド間の通信は、[AWS API Gateway](https://aws.amazon.com/api-gateway/) を使用してHTTPリクエストにより実現されています。

この設定により、フロントエンドとバックエンドのスケーリングと維持が容易になり、安定したサービスを提供できます。
