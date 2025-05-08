import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Tree } from "react-arborist";
import cn from "classnames";
import { FactionRegistry } from "@/models/FactionRegistry.models";
import { ModalNavButtons } from "../../components/ModalNavButtons";
import { EditableItemProps, FactionRegistryStepProps, TreeNode } from "./FactionRegistryStep.types";

export const EditableItem = ({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  isShaking = false,
}: EditableItemProps) => {
  return (
    <div
      className={cn(
        "flex gap-2 items-center transition-all duration-150",
        isShaking && "animate-shake"
      )}
    >
      <div className="flex flex-col">
        {canMoveUp && (
          <button
            onClick={onMoveUp}
            className="text-xs text-zinc-400 hover:text-zinc-200"
            title="Move Up"
          >
            ↑
          </button>
        )}
        {canMoveDown && (
          <button
            onClick={onMoveDown}
            className="text-xs text-zinc-400 hover:text-zinc-200"
            title="Move Down"
          >
            ↓
          </button>
        )}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded bg-zinc-700 text-light px-2 py-1 flex-1"
        placeholder="Enter name..."
      />

      <button
        onClick={onRemove}
        className="text-red-400 hover:text-red-600"
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
};


function generateTreeData(
  factionRegistry: FactionRegistry,
  depth = 1,
  playersPerassignment = 3
): TreeNode[] {
  function createNodes(level: number, path: string[]): TreeNode[] {
    if (level >= factionRegistry.sections.length) {
      return factionRegistry.assignments.map((assignment) => ({
        id: [...path, assignment].join("/"),
        name: assignment,
        children: Array.from({ length: playersPerassignment }, (_, i) => ({
          id: [...path, assignment, `player-${i + 1}`].join("/"),
          name: `Player ${i + 1}`,
        })),
      }));
    }

    const sectionName = factionRegistry.sections[level];
    return Array.from({ length: depth }, (_, i) => {
      const name = `${sectionName} ${i + 1}`;
      const nodePath = [...path, `${sectionName}-${i + 1}`];
      return {
        id: nodePath.join("/"),
        name,
        children: createNodes(level + 1, nodePath),
      };
    });
  }

  return createNodes(0, ["root"]);
}

const MAX_CATEGORIES = 4;


export const FactionRegistryStep = ({
  factionRegistry,
  setFactionRegistry,
  prevStep,
  nextStep,
}: FactionRegistryStepProps) => {
  const [shakingIndex, setShakingIndex] = useState<{
    type: "section" | "assignment",
    index: number;
  } | null>(null);

  const treeData = useMemo(
    () => generateTreeData(factionRegistry),
    [factionRegistry]
  );

  const updateItem = (
    type: "section" | "assignment",
    index: number,
    newValue: string
  ) => {
    setFactionRegistry((prev) => {
      const updated = [...prev[type === "section" ? "sections" : "assignments"]];
      updated[index] = newValue;
      return {
        ...prev,
        [type === "section" ? "sections" : "assignments"]: updated,
      };
    });
  };

  const moveItem = (
    type: "section" | "assignment",
    index: number,
    direction: "up" | "down"
  ) => {
    setFactionRegistry((prev) => {
      const key = type === "section" ? "sections" : "assignments";
      const items = [...prev[key]];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return prev;
      [items[index], items[target]] = [items[target], items[index]];
      return { ...prev, [key]: items };
    });
  };

  const removeItem = (type: "section" | "assignment", index: number) => {
    setFactionRegistry((prev) => {
      const key = type === "section" ? "sections" : "assignments";
      const updated = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: updated };
    });
  };

  const addItem = (type: "section" | "assignment") => {
    const key = type === "section" ? "sections" : "assignments";
    const max = MAX_CATEGORIES;

    if (shakeFirstEmpty(type)) return;

    setFactionRegistry((prev) => {
      const updated = [...prev[key]];
      if (updated.length < max) {
        updated.push("");
        return { ...prev, [key]: updated };
      }
      return prev;
    });
  };

  const shakeFirstEmpty = (type: "section" | "assignment"): boolean => {
    const key = type === "section" ? "sections" : "assignments";
    const list = factionRegistry[key];
    const firstEmptyIndex = list.findIndex((item) => item.trim() === "");

    if (firstEmptyIndex !== -1) {
      setShakingIndex({ type, index: firstEmptyIndex });
      setTimeout(() => setShakingIndex(null), 500);
      return true;
    }

    return false;
  };

  const isShaking = (type: "section" | "assignment", index: number) =>
    shakingIndex?.type === type && shakingIndex.index === index;

  return (
    <div className="flex flex-col gap-[10px]">
      <h3 className="text-xl text-light">Faction Registry</h3>
      <p className="text-light">
        Set up how you want players to join and be organized in your faction.
      </p>
      <p className="text-light">
        Chill - you will be able to change the structure later.
      </p>

      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-[48%]">
          <h4 className="text-light text-sm mb-1">Sections</h4>
          <div className="flex flex-col gap-2">
            {factionRegistry.sections.map((cat, i) => (
              <EditableItem
                key={`section-${i}`}
                value={cat}
                onChange={(val) => updateItem("section", i, val)}
                onRemove={() => removeItem("section", i)}
                onMoveUp={() => moveItem("section", i, "up")}
                onMoveDown={() => moveItem("section", i, "down")}
                canMoveUp={i > 0}
                canMoveDown={i < factionRegistry.sections.length - 1}
                isShaking={isShaking("section", i)}
              />
            ))}
            {factionRegistry.sections.length < MAX_CATEGORIES && (
              <button
                onClick={() => addItem("section")}
                className="text-blue-400 hover:underline text-sm"
              >
                + Add section
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-[48%]">
          <h4 className="text-light text-sm mb-1">Assignments</h4>
          <div className="flex flex-col gap-2">
            {factionRegistry.assignments.map((assignment, i) => (
              <EditableItem
                key={`assignments-${i}`}
                value={assignment}
                onChange={(val) => updateItem("assignment", i, val)}
                onRemove={() => removeItem("assignment", i)}
                onMoveUp={() => moveItem("assignment", i, "up")}
                onMoveDown={() => moveItem("assignment", i, "down")}
                canMoveUp={i > 0}
                canMoveDown={i < factionRegistry.assignments.length - 1}
                isShaking={isShaking("assignment", i)}
              />
            ))}
            {factionRegistry.assignments.length < MAX_CATEGORIES && (
              <button
                onClick={() => addItem("assignment")}
                className="text-blue-400 hover:underline text-sm"
              >
                + Add assignment
              </button>
            )}
          </div>
        </div>
      </div>
      <Tree width='100%' height={400} disableDrag={true} disableDrop={true} data={treeData}>
        {({ node, style }) => (
          <div
            style={style}
            className="flex items-center gap-2 rounded text-light shadow"
          >
            <span
              className="cursor-pointer"
              onClick={() => !node.isLeaf && node.toggle()}
            >
              {node.isLeaf ? "🧍" : node.isOpen ? "📂" : "📁"}
            </span>
            <span>{node.data.name}</span>
          </div>
        )}
      </Tree>

      <p className="text-light mt-4 mb-2">
        Continue to see a preview of your faction registry page!
      </p>

      <ModalNavButtons>
        <Button onClick={prevStep}>Back</Button>
        <Button
          onClick={() =>
            shakeFirstEmpty("section") || shakeFirstEmpty("assignment")
              ? null
              : nextStep()
          }
        >
          Continue
        </Button>
      </ModalNavButtons>
    </div>
  );
};