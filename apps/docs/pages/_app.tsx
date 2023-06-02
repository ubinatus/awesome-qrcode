import "@/styles/global.css";

import type { ReactNode } from "react";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";

type Props = AppProps & {
  Component: AppProps["Component"] & {
    getLayout: (page: ReactNode) => ReactNode;
  };
};

export default function App({ Component, pageProps }: Props) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
