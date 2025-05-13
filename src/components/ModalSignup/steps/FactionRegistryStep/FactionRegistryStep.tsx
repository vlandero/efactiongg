import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Tree } from "react-arborist";
import cn from "classnames";
import { FactionRegistryDemo } from "@/models/FactionRegistryDemo.models";
import { ModalNavButtons } from "../../components/ModalNavButtons";
import {
  AddItemParams,
  EditableItemProps,
  FactionRegistryStepProps,
  MoveItemParams,
  RemoveItemParams,
  ShakeItemParams,
  ShakingIndex,
  TreeNode,
  UpdateItemParams,
} from "./FactionRegistryStep.types";

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
    // TODO: replace colors with global css variables
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
  factionRegistry: FactionRegistryDemo,
  depth = 1,
  playersPerAssignment = 3
): TreeNode[] {
  const { sections, assignments } = factionRegistry;

  function buildSection(level: number, path: string[]): TreeNode[] {
    const section = sections[level];
    if (section === undefined) return [];

    return Array.from({ length: depth }, (_, i) => {
      const sectionLabel = `${section} ${i + 1}`;
      const sectionId = [...path, sectionLabel].join("/");
      console.log(assignments[sectionLabel]);
      const assignmentsChildren = (assignments[section] || []).map(
        (assignment) => {
          return {
            id: `${sectionId}/${assignment}`,
            name: assignment,
            children: Array.from({ length: playersPerAssignment }, (_, j) => ({
              id: `${sectionId}/${assignment}/player-${j + 1}`,
              name: `Player ${j + 1}`,
            })),
          };
        }
      );

      return {
        id: sectionId,
        name: sectionLabel,
        children: [
          ...assignmentsChildren,
          ...buildSection(level + 1, [...path, sectionLabel]),
        ],
      };
    });
  }

  return buildSection(0, []);
}

const MAX_CATEGORIES = 4;

export const FactionRegistryStep = ({
  factionRegistry,
  setFactionRegistry,
  prevStep,
  nextStep,
}: FactionRegistryStepProps) => {
  const [shakingIndex, setShakingIndex] = useState<ShakingIndex | null>(null);

  const treeData = useMemo(
    () => generateTreeData(factionRegistry),
    [factionRegistry]
  );

  const updateItem = (params: UpdateItemParams) => {
    setFactionRegistry((prev) => {
      if (params.type === "section") {
        const updatedSections = [...prev.sections];
        updatedSections[params.sectionIndex] = params.newValue;

        const oldSectionName = prev.sections[params.sectionIndex];
        const updatedAssignments: Record<string, string[]> = {
          ...prev.assignments,
        };

        if (oldSectionName in updatedAssignments) {
          updatedAssignments[params.newValue] =
            updatedAssignments[oldSectionName];
          delete updatedAssignments[oldSectionName];
        }

        return {
          ...prev,
          sections: updatedSections,
          assignments: updatedAssignments,
        };
      } else {
        const sectionName = params.sectionKey;
        const updatedAssignments = {
          ...prev.assignments,
          [sectionName]: [...(prev.assignments[sectionName] || [])],
        };
        updatedAssignments[sectionName][params.index] = params.newValue;

        return {
          ...prev,
          assignments: updatedAssignments,
        };
      }
    });
  };

  const moveItem = (params: MoveItemParams) => {
    setFactionRegistry((prev) => {
      if (params.type === "section") {
        const sections = [...prev.sections];
        const target =
          params.direction === "up" ? params.index - 1 : params.index + 1;
        if (target < 0 || target >= sections.length) return prev;
        [sections[params.index], sections[target]] = [
          sections[target],
          sections[params.index],
        ];
        return { ...prev, sections };
      } else {
        const { sectionKey, index, direction } = params;
        const assignments = { ...prev.assignments };
        const list = [...(assignments[sectionKey] || [])];
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= list.length) return prev;
        [list[index], list[target]] = [list[target], list[index]];
        assignments[sectionKey] = list;
        return { ...prev, assignments };
      }
    });
  };

  const removeItem = (params: RemoveItemParams) => {
    setFactionRegistry((prev) => {
      if (params.type === "section") {
        const sections = prev.sections.filter((_, i) => i !== params.index);
        const updatedAssignments: Record<string, string[]> = {};

        prev.sections.forEach((name, i) => {
          if (i !== params.index && name in prev.assignments) {
            updatedAssignments[name] = prev.assignments[name];
          }
        });

        return { ...prev, sections, assignments: updatedAssignments };
      } else {
        const { sectionKey, index } = params;
        const updatedAssignments = {
          ...prev.assignments,
          [sectionKey]: prev.assignments[sectionKey].filter(
            (_, i) => i !== index
          ),
        };
        return { ...prev, assignments: updatedAssignments };
      }
    });
  };

  const addItem = (params: AddItemParams) => {
    if (shakeFirstEmpty(params)) return;

    setFactionRegistry((prev) => {
      if (params.type === "section") {
        if (prev.sections.length >= MAX_CATEGORIES) return prev;
        return { ...prev, sections: [...prev.sections, ""] };
      } else {
        const sectionKey = params.sectionKey;
        const list = prev.assignments[sectionKey] || [];
        if (list.length >= MAX_CATEGORIES) return prev;

        return {
          ...prev,
          assignments: {
            ...prev.assignments,
            [sectionKey]: [...list, ""],
          },
        };
      }
    });
  };

  const shakeFirstEmpty = (params: ShakeItemParams): boolean => {
    // TODO just look through all the section names and the assignments and check if there is any one that is an empty string
    if (params.type === "section") {
      const index = factionRegistry.sections.findIndex((s) => s.trim() === "");
      if (index !== -1) {
        setShakingIndex({ type: "section", index });
        setTimeout(() => setShakingIndex(null), 500);
        return true;
      }
    } else {
      const { sectionKey } = params; // TODO for all
      const list = factionRegistry.assignments[sectionKey] || [];
      const index = list.findIndex((a) => a.trim() === "");
      if (index !== -1) {
        setShakingIndex({ type: "assignment", index, sectionKey });
        setTimeout(() => setShakingIndex(null), 500);
        return true;
      }
    }
    return false;
  };

  const isShaking = (
    type: "section" | "assignment",
    index: number,
    sectionKey?: string
  ) => {
    if (!shakingIndex) return false;
    if (type === "section") {
      return shakingIndex.type === "section" && shakingIndex.index === index;
    } else {
      return (
        shakingIndex.type === "assignment" &&
        shakingIndex.index === index &&
        shakingIndex.sectionKey === sectionKey
      );
    }
  };

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
                onChange={(val) =>
                  updateItem({
                    type: "section",
                    sectionIndex: i,
                    newValue: val,
                  })
                }
                onRemove={() => removeItem({ type: "section", index: i })}
                onMoveUp={() =>
                  moveItem({ type: "section", direction: "up", index: i })
                }
                onMoveDown={() =>
                  moveItem({ type: "section", direction: "up", index: i })
                }
                canMoveUp={i > 0}
                canMoveDown={i < factionRegistry.sections.length - 1}
                isShaking={isShaking("section", i)}
              />
            ))}
            {factionRegistry.sections.length < MAX_CATEGORIES && (
              <button
                onClick={() => addItem({ type: "section" })}
                className="text-blue-400 hover:underline text-sm"
              >
                + Add section
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-[48%]">
          <h4 className="text-light text-sm mb-1">Assignments</h4>
          <div>
            {factionRegistry.sections.map((s) => (
              <div>
                <p className="text-light text-sm mb-1">{s}</p>
                <div className="flex flex-col gap-2">
                  {(factionRegistry.assignments[s] || []).map(
                    (assignment, i) => (
                      <EditableItem
                        key={`assignments-${i}`}
                        value={assignment}
                        onChange={(val) =>
                          updateItem({
                            type: "assignment",
                            index: i,
                            newValue: val,
                            sectionKey: s,
                          })
                        }
                        onRemove={() =>
                          removeItem({
                            type: "assignment",
                            index: i,
                            sectionKey: s,
                          })
                        }
                        onMoveUp={() =>
                          moveItem({
                            type: "assignment",
                            index: i,
                            direction: "up",
                            sectionKey: s,
                          })
                        }
                        onMoveDown={() =>
                          moveItem({
                            type: "assignment",
                            index: i,
                            direction: "down",
                            sectionKey: s,
                          })
                        }
                        canMoveUp={i > 0}
                        canMoveDown={
                          i < factionRegistry.assignments[s].length - 1
                        }
                        isShaking={isShaking("assignment", i)}
                      />
                    )
                  )}
                  {(factionRegistry.assignments[s] || []).length <
                    MAX_CATEGORIES &&
                    s.trim() !== "" && (
                      <button
                        onClick={() =>
                          addItem({ type: "assignment", sectionKey: s })
                        }
                        className="text-blue-400 hover:underline text-sm"
                      >
                        + Add assignment
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Tree
        width="100%"
        height={400}
        disableDrag={true}
        disableDrop={true}
        data={treeData}
      >
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
            shakeFirstEmpty({ type: "section" }) ||
            shakeFirstEmpty({ type: "assignment", sectionKey: "" })
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
