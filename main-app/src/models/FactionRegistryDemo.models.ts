import { Player } from "./Player.model";

export type Section = {
  id: string;
  name: string;
};

export type Assignment = {
  id: string;
  name: string;
  players: Player[]
};

export type FactionRegistry = {
  sections: Section[];
  assignments: Record<string, Assignment[]>; // section -> assignment[]
};
