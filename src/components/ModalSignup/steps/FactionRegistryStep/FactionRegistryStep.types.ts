import { FactionRegistryDemo } from "@/models/FactionRegistryDemo.models";

export type TreeNode = {
  id: string;
  name: string;
  children?: TreeNode[];
};

export type EditableItemProps = {
  value: string;
  onChange: (newValue: string) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isShaking?: boolean;
};

export type FactionRegistryStepProps = {
  factionRegistry: FactionRegistryDemo;
  setFactionRegistry: React.Dispatch<React.SetStateAction<FactionRegistryDemo>>;
  prevStep: () => void;
  nextStep: () => void;
};

export type ShakingIndex =
  | { type: "section"; index: number }
  | { type: "assignment"; sectionKey: string; index: number };

export type UpdateItemParams =
  | {
      type: "section";
      sectionIndex: number;
      newValue: string;
    }
  | {
      type: "assignment";
      sectionKey: string;
      index: number;
      newValue: string;
    };

export type MoveItemParams =
  | {
      type: "section";
      index: number;
      direction: "up" | "down";
    }
  | {
      type: "assignment";
      sectionKey: string;
      index: number;
      direction: "up" | "down";
    };

export type RemoveItemParams =
  | {
      type: "section";
      index: number;
    }
  | {
      type: "assignment";
      sectionKey: string;
      index: number;
    };

export type AddItemParams =
  | {
      type: "section";
    }
  | {
      type: "assignment";
      sectionKey: string;
    };

export type ShakeItemParams =
  | {
      type: "section";
    }
  | {
      type: "assignment";
      sectionKey: string;
    };
