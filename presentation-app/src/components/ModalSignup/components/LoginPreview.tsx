// components/LoginPreview.tsx
import Image from "next/image";
import { useState } from "react";

interface LoginPreviewProps {
  logo: string | null;
  bgColors: string[];
  bgDirection: "to right" | "to bottom";
  orgName: string;
  theme: "dark" | "light";
}

export default function LoginPreview({
  logo = "/placeholder_logo.png",
  bgColors,
  bgDirection,
  orgName,
  theme,
}: LoginPreviewProps) {
  const [isLogin, setIsLogin] = useState(true);

  const darkCard = theme === "dark";
  const gradientStyle = {
    backgroundImage: `linear-gradient(${bgDirection}, ${bgColors.join(", ")})`,
    height: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.75rem",
    overflow: "hidden",
    padding: '50px'
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(${bgDirection}, ${bgColors.join(", ")})`,
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "0.75rem",
        overflow: "hidden",
        padding: "50px",
      }}
      className="login-preview"
    >
      <div
        className={`p-4 rounded-xl shadow-md w-[80%] max-w-[400px] ${darkCard ? "bg-zinc-900 text-zinc-100" : "bg-white/90 text-zinc-800"
          }`}
      >
        <h2 className="text-center text-lg font-bold mb-1">{orgName}</h2>

        <h1 className="text-sm font-semibold text-center mb-2">
          {isLogin ? "Log In" : "Register"}
        </h1>

        {logo && (
          <div className="flex justify-center mb-2">
            <Image
              src={logo}
              alt="Organization Logo"
              width={40}
              height={40}
              className="rounded"
            />
          </div>
        )}

        <form className="space-y-2">
          <input
            disabled
            type="email"
            placeholder="Email"
            className={`w-full text-sm p-1 rounded border ${darkCard
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400"
                : "border-zinc-300"
              }`}
          />
          <input
            disabled
            type="password"
            placeholder="Password"
            className={`w-full text-sm p-1 rounded border ${darkCard
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400"
                : "border-zinc-300"
              }`}
          />
          {!isLogin && (
            <input
              disabled
              type="text"
              placeholder="Username"
              className={`w-full text-sm p-1 rounded border ${darkCard
                  ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400"
                  : "border-zinc-300"
                }`}
            />
          )}
          <button
            disabled
            type="submit"
            className={`w-full py-1 rounded text-sm font-medium ${darkCard
                ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-2 text-center">
          <button
            disabled
            className={`text-xs hover:underline ${darkCard ? "text-zinc-400" : "text-zinc-600"
              }`}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
  );
}
