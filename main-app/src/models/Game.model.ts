export type Player = {
    name: string;
    champion: string;
};

export type Team = {
    players: Player[];
};

export type Game = {
    id: string;
    blueWon: boolean
    blue: Team;
    red: Team;
    gameLength: string;
};
