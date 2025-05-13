export type Section = {
  id: string;
  name: string;
};

export type Assignment = {
  id: string;
  name: string;
};

export type FactionRegistryDemo = {
  sections: string[];
  assignments: Record<string, string[]>; // section -> assignment[]
};
