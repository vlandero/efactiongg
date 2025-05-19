import { useUser } from "@/contexts/UserContext";
import { Assignment } from "@/models/DB/FactionRegistry.model";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useUser();
  const [myTeam, setMyTeam] = useState<Assignment | null>(null);

  // Simulated fetch (replace with actual API call)
  useEffect(() => {
    if (user) {
      // Fake fetch logic
      fetch("/api/team") // Or however your backend is structured
        .then(res => res.json())
        .then((data: Assignment[]) => {
          const team = data.find(team => team.players.some(p => p.id === user.id));
          setMyTeam(team || null);
        });
    }
  }, [user]);

  if (!user) return <p className="text-center mt-10">Loading user...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-indigo-900 p-8 text-white">
      <div className="max-w-3xl mx-auto bg-zinc-900 p-6 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.username} 👋</h1>

        <h2 className="text-xl font-semibold mt-6 mb-2">My Team</h2>

        {myTeam ? (
          <div className="bg-zinc-800 p-4 rounded-lg space-y-2">
            <p className="text-lg font-medium">{myTeam.name}</p>
            <ul className="list-disc ml-5">
              {myTeam.players.map(player => (
                <li key={player.id}>{player.username}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-zinc-400">You are not assigned to a team yet.</p>
        )}
      </div>
    </div>
  );
}
