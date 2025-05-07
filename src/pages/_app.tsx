import type { Metadata } from "next";
import "../globals.css";
import { TRPCProvider } from "../_trpc/provider";
import { AppType } from "next/app";

export const metadata: Metadata = {
  title: "eFaction.gg",
  description: "Create and maintain your own gaming org",
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <TRPCProvider>
      <Component {...pageProps} />
    </TRPCProvider>
  );
};

export default MyApp;
