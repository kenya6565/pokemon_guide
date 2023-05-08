// apolloClient.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:8080/query', // GraphQL サーバーのエンドポイント
  cache: new InMemoryCache(),
});

export default apolloClient;
