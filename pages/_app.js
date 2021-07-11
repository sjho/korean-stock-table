import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react"
import { css, Global } from "@emotion/react";
import { Layout } from "components/layout"

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Head>
        <title>한국 주식 종목 ROE 순위</title>
      </Head>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            font-family: "Noto Sans KR", sans-serif;
          }

          svg {
            display: block;
          }
        `}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default MyApp