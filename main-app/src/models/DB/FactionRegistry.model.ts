import { User } from "./User.model";

export type Section = {
  id: string;
  name: string;
  isTeam?: boolean;
};

export type Assignment = {
  id: string;
  name: string;
  isTeam?: boolean;
};

export type FactionRegistry = {
  sections: Section[];
  assignments: Record<string, Assignment[]>;
};

export type PlayerAssignment = {
  user: User;
  sectionPath: string[];
  assignmentId: string;
};

export type FactionRegistryFull = {
  registry: FactionRegistry;
  players: PlayerAssignment[];
};
