import { FactionRegistryDemo } from "@/models/FactionRegistryDemo.models";

export type TreeNode = {
  id: string;
  name: string;
  children?: TreeNode[];
};

export type EditableItemProps = {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isShaking?: boolean;
  isTeam?: boolean; // NEW
  onToggleTeam?: (checked: boolean) => void; // NEW
};


export type FactionRegistryStepProps = {
  factionRegistry: FactionRegistryDemo;
  setFactionRegistry: React.Dispatch<React.SetStateAction<FactionRegistryDemo>>;
  prevStep: () => void;
  nextStep: () => void;
};

export type ShakingIndex =
  | { type: "section"; index: number }
  | { type: "assignment"; sectionId: string; index: number };

export type UpdateItemParams =
  | {
    type: "section";
    sectionIndex: number;
    newValue: string;
  }
  | {
    type: "assignment";
    sectionId: string;
    assignmentIndex: number;
    newValue: string;
  };

export type MoveItemParams =
  | {
    type: "section";
    sectionIndex: number;
    direction: "up" | "down";
  }
  | {
    type: "assignment";
    sectionId: string;
    assignmentIndex: number;
    direction: "up" | "down";
  };

export type RemoveItemParams =
  | {
    type: "section";
    sectionId: string;
  }
  | {
    type: "assignment";
    sectionId: string;
    assignmentId: string;
  };

export type AddItemParams =
  | {
    type: "section";
  }
  | {
    type: "assignment";
    sectionId: string;
  };
