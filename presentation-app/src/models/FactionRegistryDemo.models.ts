export type Section = {
  id: string;
  name: string;
};

export type Assignment = {
  id: string;
  name: string;
};

export type FactionRegistryDemo = {
  sections: Section[];
  assignments: Record<string, Assignment[]>; // section -> assignment[]
};
