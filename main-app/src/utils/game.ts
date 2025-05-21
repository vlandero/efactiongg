import { Game, Player, Team } from "@/models/Game.model";
import { v4 as uuidv4 } from "uuid";

export function getChampionNameFromSkin(skin: string): string {
    const rawName = skin.replace(/Skin.*/, '');
    return rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
}


export function getChampionIconUrl(championName: string): string {
    return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${championName}.png`;
}

export function parseGame(raw: any): Game {
    const { gameLength, statsJson } = raw.metadata;

    const players: Player[] = statsJson.map((p: any) => ({
        name: p.RIOT_ID_GAME_NAME || "Unknown",
        champion: p.SKIN ? getChampionNameFromSkin(p.SKIN) : "Unknown",
        won: p.WIN !== 'FAIL'
    }));

    const blue: Team = { players: players.slice(0, 5) };
    const red: Team = { players: players.slice(5, 10) };

    return {
        id: uuidv4(),
        blue,
        red,
        blueWon: blue.players[0].won,
        gameLength: `${Math.floor(gameLength / 60000)}:${String(Math.floor((gameLength % 60000) / 1000)).padStart(2, '0')}`
    };
}
