"use client";

import { useRef, useState, useEffect } from "react";
import { trpc } from "@/_trpc/client";
import { Game, Team } from "@/models/Game.model";
import { getChampionIconUrl, parseGame } from "@/utils/game";
import { GetServerSideProps } from "next";
import Select from "react-select";
import Modal from "@/components/Modal";

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

function ChampionStats({ calculateWinrate }: { calculateWinrate: (champ: string) => string }) {
    const [champions, setChampions] = useState<{ label: string, value: string }[]>([]);
    const [selectedChampion, setSelectedChampion] = useState("");

    useEffect(() => {
        fetch("https://ddragon.leagueoflegends.com/cdn/14.9.1/data/en_US/champion.json")
            .then((res) => res.json())
            .then((data) => {
                const champList = Object.values(data.data).map((champ: any) => ({
                    label: champ.name,
                    value: champ.id,
                }));
                setChampions(champList);
            });
    }, []);

    return (
        <div className="space-y-4">
            <div>
                <label className="block mb-2 text-sm">Champion</label>
                <Select
                    options={champions}
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            backgroundColor: "#262626",
                            borderColor: "#404040",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            boxShadow: state.isFocused ? "0 0 0 1px #737373" : "none",
                            minHeight: "unset",
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: "white",
                        }),
                        input: (provided) => ({
                            ...provided,
                            color: "white",
                        }),
                        menu: (provided) => ({
                            ...provided,
                            backgroundColor: "#262626",
                            borderColor: "#404040",
                            zIndex: 10,
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused ? "#3f3f46" : "#262626",
                            color: "white",
                            cursor: "pointer",
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            color: "#a3a3a3",
                        }),
                    }}
                    onChange={(option) => setSelectedChampion(option?.value || "")}
                    className="text-black"
                    placeholder="Select a champion..."
                />
            </div>
            {selectedChampion && (
                <div className="text-lg">
                    Winrate for <strong>{selectedChampion}</strong>: {calculateWinrate(selectedChampion)}
                </div>
            )}
        </div>
    );
}


type CategorizedGames = Record<string, Game[]>;

export default function AnalyticsPage({ categorizedGames }: { categorizedGames: CategorizedGames }) {
    const [showModal, setShowModal] = useState(false);
    const [newGame, setNewGame] = useState<Game | null>(null);
    const [categoryInput, setCategoryInput] = useState("");

    const parseRofl = trpc.parseRofl.parse.useMutation();
    const [categories, setCategories] = useState<Record<string, boolean>>(
        Object.fromEntries(Object.keys(categorizedGames).map((key) => [key, true]))
    );
    const [games, setGames] = useState<Game[]>(
        Object.entries(categorizedGames)
            .flatMap(([category, games]) => categories[category] ? games : [])
    );
    const [selectedTab, setSelectedTab] = useState<"matches" | "statistics">("matches");
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

        const game = parseGame(parsed);
        setNewGame(game);
        setShowModal(true);
        if (inputRef.current) inputRef.current.value = "";
    };

    const assignGameToCategory = (category: string) => {
        if (!newGame) return;
        categorizedGames[category] = [newGame, ...(categorizedGames[category] || [])];

        if (!categories[category]) {
            setCategories(prev => ({ ...prev, [category]: true }));
        }

        setNewGame(null);
        setShowModal(false);
        refreshGames();
    };

    const removeCategory = (cat: string) => {
        console.log(categorizedGames)
        if (categorizedGames[cat]?.length > 0) {
            alert(`Cannot remove "${cat}" because it still contains games.`);
            return;
        }

        const updated = { ...categories };
        delete updated[cat];
        delete categorizedGames[cat];
        setCategories(updated);
        refreshGames();
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

                <div className="flex gap-4 flex-wrap">
                    {Object.keys(categories).map((cat) => (
                        <div key={cat} className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded">
                            <input
                                type="checkbox"
                                checked={categories[cat]}
                                onChange={() => handleCheckboxChange(cat)}
                                className="accent-blue-500"
                            />
                            <span>{cat}</span>
                            <button
                                onClick={() => removeCategory(cat)}
                                className="text-red-400 hover:text-red-300 ml-1 text-sm"
                                title="Remove category"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <div>
                        <label className="text-sm mb-1 block">Add new category:</label>
                        <div className="flex gap-2">
                            <input
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                placeholder="e.g., scrims"
                                className="bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-white"
                            />
                            <button
                                onClick={() => {
                                    const trimmed = categoryInput.trim();
                                    if (trimmed) {
                                        if (!categorizedGames[trimmed]) {
                                            categorizedGames[trimmed] = [];
                                            setCategories((prev) => ({ ...prev, [trimmed]: true }));
                                            refreshGames();
                                        }
                                        setCategoryInput("");
                                    }
                                }}
                                className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white"
                            >
                                Add
                            </button>

                        </div>
                    </div>
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
                    <ChampionStats calculateWinrate={calculateWinrate} />
                )}
            </div>
            {showModal && newGame && (
                <Modal title="Choose a Category" onClose={() => setShowModal(false)} overlayClickable>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm mb-1 block">Select existing category:</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(categories).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => assignGameToCategory(cat)}
                                        className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-600 text-white text-sm"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

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
