import { GameInDB } from "./GameInDB.model";
import { User } from "./User.model";

export type Section = {
  id: string;
  name: string;
  game?: GameInDB;
};

export type Assignment = {
  id: string;
  name: string;
  players: User[]
};

export type FactionRegistry = {
  sections: Section[];
  assignments: Record<string, Assignment[]>; // section -> assignment[]
};
