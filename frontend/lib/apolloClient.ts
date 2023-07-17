// apolloClient.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, // GraphQL サーバーのエンドポイント
  cache: new InMemoryCache(),
});

export default apolloClient;
