import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      console.log("Fetching dashboard data for:", user);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="m-auto mt-20 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-[90%] max-w-[1300px]">
        <div
          onClick={() => router.push('/registry')}
          className="bg-neutral-800 hover:bg-neutral-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">Total Players</h2>
          <p className="text-4xl font-bold text-primary">128</p>
        </div>


        <section className="bg-neutral-800 p-6 rounded-2xl shadow-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Team</h2>
          <ul className="space-y-2">
            <li className="bg-neutral-700 p-3 rounded-lg">
              <span className="font-bold">Coach:</span> Player 1
            </li>
            <li className="bg-neutral-700 p-3 rounded-lg">
              <span className="font-bold">Main Roster:</span>
              <ul className="ml-4 mt-1 space-y-1">
                <li>Player 2</li>
                <li>Player 3</li>
              </ul>
            </li>
            <li className="bg-neutral-700 p-3 rounded-lg">
              <span className="font-bold">Subs:</span>
              <ul className="ml-4 mt-1 space-y-1">
                <li>Player 4</li>
                <li>Player 5</li>
              </ul>
            </li>
          </ul>
        </section>

        <div
          onClick={() => router.push('/analytics')}
          className="bg-neutral-800 p-6 rounded-2xl shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:bg-neutral-600 cursor-pointer lg:col-span-3 md:col-span-2 transition-all duration-300 ease-in-out"
        >
          <h2 className="text-xl font-semibold mb-4">Team Analytics</h2>
          <div className="bg-neutral-700 p-4 rounded-lg">
            Win rate: 72% | Avg KDA: 3.5
          </div>
        </div>


        {/* Forum */}
        <section className="bg-neutral-800 p-6 rounded-2xl shadow-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Forum</h2>
          <ul className="space-y-2">
            <li className="bg-neutral-700 p-3 rounded-lg hover:bg-neutral-600 transition-colors cursor-pointer">
              <span className="text-blue-400 font-medium">
                💬 "We've been struggling on defense lately, any ideas?"
              </span>
            </li>
            <li className="bg-neutral-700 p-3 rounded-lg hover:bg-neutral-600 transition-colors cursor-pointer">
              <span className="text-blue-400 font-medium">
                🕒 "Let’s vote on scrim times for next week!"
              </span>
            </li>
            <li className="bg-neutral-700 p-3 rounded-lg hover:bg-neutral-600 transition-colors cursor-pointer">
              <span className="text-blue-400 font-medium">
                🔧 "Ideas to optimize our practice schedule?"
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
