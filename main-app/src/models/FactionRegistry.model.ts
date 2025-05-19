import { User } from "./Player.model";

export type Section = {
  id: string;
  name: string;
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
