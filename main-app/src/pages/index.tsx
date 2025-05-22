// pages/index.tsx
import { useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

interface HomePageProps {
  orgLogoUrl?: string;
  backgroundGradient: string[];
  vertical: boolean;
  allowRegistration: boolean;
  orgName: string;
  darkCard: boolean;
}

export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async () => {
  return {
    props: {
      orgLogoUrl: "/placeholder_logo.png",
      backgroundGradient: ["#e66465", "#9198e5"],
      vertical: true,
      allowRegistration: true,
      orgName: "Cyberpunk eSports",
      darkCard: true,
    },
  };
};

export default function Login({
  orgLogoUrl,
  backgroundGradient,
  vertical,
  allowRegistration,
  orgName,
  darkCard,
}: HomePageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const gradientStyle = {
    backgroundImage: `linear-gradient(${
      vertical ? "to bottom" : "to right"
    }, ${backgroundGradient.join(", ")})`,
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={gradientStyle}
    >
      <div
        className={`p-8 rounded-xl shadow-xl w-full max-w-md ${
          darkCard ? "bg-zinc-900 text-zinc-100" : "bg-white/90 text-zinc-800"
        }`}
      >
        <h2 className="text-center text-2xl font-bold mb-2">{orgName}</h2>

        <h1 className="text-xl font-semibold text-center mb-4">
          {isLogin ? "Log In" : "Register"}
        </h1>

        {orgLogoUrl && (
          <div className="flex justify-center mb-4">
            <Image
              src={orgLogoUrl}
              alt="Organization Logo"
              width={90}
              height={90}
              className="rounded"
            />
          </div>
        )}

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-2 rounded border ${
              darkCard
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400"
                : "border-zinc-300"
            }`}
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-2 rounded border ${
              darkCard
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400"
                : "border-zinc-300"
            }`}
          />
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className={`w-full p-2 rounded border ${
                darkCard
                  ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400"
                  : "border-zinc-300"
              }`}
            />
          )}
          <button
            type="button"
            className={`w-full py-2 rounded font-medium ${
              darkCard
                ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
            onClick={() => {
              router.replace("/home");
            }}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {allowRegistration && (
          <div className="mt-4 text-center">
            <button
              className={`text-sm hover:underline ${
                darkCard ? "text-zinc-400" : "text-zinc-600"
              }`}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Log in"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
