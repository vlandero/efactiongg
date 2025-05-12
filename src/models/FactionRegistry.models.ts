export type FactionRegistry = {
  sections: string[];
  assignments: Record<string, string[]>; // section -> assignment[]
};