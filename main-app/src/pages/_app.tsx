import type { Metadata } from "next";
import "../globals.css";
import { TRPCProvider } from "../_trpc/provider";
import { AppType } from "next/app";
import { UserProvider } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

export const metadata: Metadata = {
  title: "eFaction.gg",
  description: "Create and maintain your own gaming faction",
};

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <TRPCProvider>
      <UserProvider>
        {router.pathname !== "/" && <Navbar />}
        <Component {...pageProps} />
      </UserProvider>
    </TRPCProvider>
  );
};

export default MyApp;
