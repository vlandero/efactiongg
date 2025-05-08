import { FactionRegistry } from "@/models/FactionRegistry.models";

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
  factionRegistry: FactionRegistry;
  setFactionRegistry: React.Dispatch<React.SetStateAction<FactionRegistry>>;
  prevStep: () => void;
  nextStep: () => void;
}