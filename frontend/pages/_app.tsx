import '@/styles/globals.css'
import '../../frontend/styles/pokemon.css';
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient'; // Apolloクライアントの設定ファイル


export default function App({ Component, pageProps }: AppProps) {
  return (
  <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
  )
}
