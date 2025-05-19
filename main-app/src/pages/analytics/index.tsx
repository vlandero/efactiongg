"use client";

import { useRef, useState } from "react";
import { trpc } from "@/_trpc/client";
import { Game, Team } from "@/models/Game.model";
import { getChampionIconUrl, parseGame } from "@/utils/game";
import { GetServerSideProps } from "next";

function GameCard({ game, onRemove }: { game: Game; onRemove: (id: string) => void }) {
    return (
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-lg max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="text-neutral-200 text-lg font-semibold">
                    Game Length: {game.gameLength}
                </div>
                <button
                    onClick={() => onRemove(game.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                >
                    Remove
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <TeamBlock team={game.blue} color="blue" />
                <TeamBlock team={game.red} color="red" />
            </div>
        </div>
    );
}

function TeamBlock({ team, color }: { team: Team; color: "blue" | "red" }) {
    return (
        <div className={`p-4 rounded-lg ${color === "blue" ? "bg-blue-900" : "bg-red-900"}`}>
            <h3 className="text-lg font-bold text-white mb-2">{color.toUpperCase()} Team</h3>
            <ul className="space-y-2">
                {team.players.map((player) => (
                    <li key={player.name} className="flex items-center space-x-2 text-white">
                        <img
                            src={getChampionIconUrl(player.champion)}
                            alt={player.champion}
                            className="w-8 h-8 rounded"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <span>{player.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

type CategorizedGames = Record<string, Game[]>;

export default function AnalyticsPage({ categorizedGames }: { categorizedGames: CategorizedGames }) {
    const parseRofl = trpc.parseRofl.parse.useMutation();
    const [categories, setCategories] = useState<Record<string, boolean>>(
        Object.fromEntries(Object.keys(categorizedGames).map((key) => [key, true]))
    );
    const [games, setGames] = useState<Game[]>(
        Object.entries(categorizedGames)
            .flatMap(([category, games]) => categories[category] ? games : [])
    );
    const [selectedTab, setSelectedTab] = useState<"matches" | "statistics">("matches");
    const [selectedChampion, setSelectedChampion] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !file.name.endsWith(".rofl")) return;

        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");

        const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64, filename: file.name }),
        });

        const resJson = await res.json();
        const parsed = await parseRofl.mutateAsync({ path: resJson.path });

        const newGame = parseGame(parsed);
        const category = "scrims"; // default to scrims for new uploads
        categorizedGames[category] = [newGame, ...(categorizedGames[category] || [])];
        refreshGames();
        if (inputRef.current) inputRef.current.value = "";
    };

    const refreshGames = () => {
        const filteredGames = Object.entries(categorizedGames)
            .flatMap(([category, games]) => categories[category] ? games : []);
        setGames(filteredGames);
    };

    const removeGame = (id: string) => {
        for (const category of Object.keys(categorizedGames)) {
            categorizedGames[category] = categorizedGames[category].filter((game) => game.id !== id);
        }
        refreshGames();
    };

    const handleCheckboxChange = (category: string) => {
        const updated = { ...categories, [category]: !categories[category] };
        setCategories(updated);
        const filteredGames = Object.entries(categorizedGames)
            .flatMap(([cat, games]) => updated[cat] ? games : []);
        setGames(filteredGames);
    };

    const calculateWinrate = (champ: string) => {
        let wins = 0;
        let total = 0;
        for (const game of games) {
            const isInBlue = game.blue.players.some((p) => p.champion === champ);
            const isInRed = game.red.players.some((p) => p.champion === champ);
            if (isInBlue || isInRed) {
                total++;
                if ((isInBlue && game.blueWon) || (isInRed && !game.blueWon)) {
                    wins++;
                }
            }
        }
        return total > 0 ? ((wins / total) * 100).toFixed(1) + "%" : "N/A";
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Match Analytics</h1>
                    <label className="bg-neutral-700 px-4 py-2 rounded-md cursor-pointer hover:bg-neutral-600 transition">
                        Upload ROFL file
                        <input ref={inputRef} type="file" accept=".rofl" onChange={handleFile} hidden />
                    </label>
                </div>

                <div className="flex gap-4">
                    {Object.keys(categories).map((cat) => (
                        <label key={cat} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={categories[cat]}
                                onChange={() => handleCheckboxChange(cat)}
                                className="accent-blue-500"
                            />
                            <span>{cat}</span>
                        </label>
                    ))}
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => setSelectedTab("matches")}
                        className={`px-4 py-2 rounded ${selectedTab === "matches" ? "bg-blue-700" : "bg-neutral-700"}`}
                    >
                        Matches
                    </button>
                    <button
                        onClick={() => setSelectedTab("statistics")}
                        className={`px-4 py-2 rounded ${selectedTab === "statistics" ? "bg-blue-700" : "bg-neutral-700"}`}
                    >
                        Statistics
                    </button>
                </div>

                {selectedTab === "matches" && (
                    <div className="flex flex-col items-center gap-6">
                        {games.length === 0 ? (
                            <p className="text-neutral-400">No games loaded yet.</p>
                        ) : (
                            games.map((game) => (
                                <GameCard key={game.id} game={game} onRemove={removeGame} />
                            ))
                        )}
                    </div>
                )}

                {selectedTab === "statistics" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm">Champion Name</label>
                            <input
                                value={selectedChampion}
                                onChange={(e) => setSelectedChampion(e.target.value)}
                                className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded"
                                placeholder="e.g., Ahri"
                            />
                        </div>
                        <div className="text-lg">
                            Winrate for <strong>{selectedChampion}</strong>: {calculateWinrate(selectedChampion)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const categories = ["scrims", "official"];
    const categorizedGames: CategorizedGames = {};
    for (const cat of categories) {
        categorizedGames[cat] = Array.from({ length: 3 }).map((_, i) => ({
            id: `${cat}-game-${i}`,
            gameLength: "32:15",
            blueWon: i % 2 === 0,
            blue: {
                players: Array.from({ length: 5 }).map((_, j) => ({
                    name: `${cat}-Player${j + 1}`,
                    champion: "Ahri",
                })),
            },
            red: {
                players: Array.from({ length: 5 }).map((_, j) => ({
                    name: `${cat}-Enemy${j + 1}`,
                    champion: "Zed",
                })),
            },
        }));
    }

    return {
        props: {
            categorizedGames,
        },
    };
};
