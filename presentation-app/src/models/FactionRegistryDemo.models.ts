export type Section = {
  id: string;
  name: string;
  isTeam?: boolean
};

export type Assignment = {
  id: string;
  name: string;
  isTeam?: boolean;
};


export type FactionRegistryDemo = {
  sections: Section[];
  assignments: Record<string, Assignment[]>; // section -> assignment[]
};
