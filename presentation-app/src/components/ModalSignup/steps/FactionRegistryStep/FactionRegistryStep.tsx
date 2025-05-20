import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Tree } from "react-arborist";
import cn from "classnames";
import {
  Assignment,
  FactionRegistryDemo,
} from "@/models/FactionRegistryDemo.models";
import { ModalNavButtons } from "../../components/ModalNavButtons";
import {
  AddItemParams,
  EditableItemProps,
  FactionRegistryStepProps,
  MoveItemParams,
  RemoveItemParams,
  ShakingIndex,
  TreeNode,
  UpdateItemParams,
} from "./FactionRegistryStep.types";
import { generateId } from "@/utils/generateId";

export const EditableItem = ({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  isShaking = false,
  isTeam,
  onToggleTeam,
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

      <div className="flex items-center gap-2 flex-wrap">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-medium min-w-0 flex-1"
          placeholder="Enter name..."
        />

        {onToggleTeam && (
          <label className="flex items-center gap-1 text-xs text-zinc-400 whitespace-nowrap">
            <input
              type="checkbox"
              checked={isTeam}
              onChange={(e) => onToggleTeam(e.target.checked)}
            />
          </label>
        )}

        <button onClick={onRemove} className="reject-color" title="Remove">
          ✕
        </button>
      </div>
    </div>
  );
};

function generateTreeData(
  factionRegistry: FactionRegistryDemo,
  depth = 1,
  playersPerAssignment = 3 // TODO BUG HERE??? IF WE PUT 10
): TreeNode[] {
  const { sections, assignments } = factionRegistry;

  function buildSection(level: number, path: string[]): TreeNode[] {
    const section = sections[level];
    if (section === undefined) return [];

    return Array.from({ length: depth }, (_, i) => {
      const sectionLabel = `${section.name} ${i + 1}`;
      const sectionId = [...path, sectionLabel].join("/");
      // console.log(assignments[sectionLabel]);
      const assignmentsChildren = (assignments[section.id] || []).map(
        (assignment) => {
          return {
            id: `${sectionId}/${assignment.id}`,
            name: `${assignment.name}${assignment.isTeam ? " (team)" : ""}`,
            children:
              assignment.name.trim() !== ""
                ? Array.from({ length: playersPerAssignment }, (_, j) => ({
                    id: `${sectionId}/${assignment.id}/player-${j + 1}`,
                    name: `Player ${j + 1}`,
                  }))
                : [],
          };
        }
      );

      return {
        id: sectionId,
        name: `${sectionLabel}${section.isTeam ? " (team)" : ""}`,
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
  const [team, setTeam] = useState(() => {
    for (const section of factionRegistry.sections) {
      if (section.isTeam) {
        return {
          sectionId: section.id,
        };
      }
      const assignments = factionRegistry.assignments[section.id] || [];
      for (const assignment of assignments) {
        if (assignment.isTeam) {
          return {
            sectionId: section.id,
            assignmentId: assignment.id,
          };
        }
      }
    }
    return null;
  });

  const treeData = useMemo(
    () => generateTreeData(factionRegistry),
    [factionRegistry]
  );

  const updateItem = (params: UpdateItemParams) => {
    // TODO: add maximum character number for names
    setFactionRegistry((prev) => {
      if (params.type === "section") {
        const updatedSections = [...prev.sections];
        updatedSections[params.sectionIndex].name = params.newValue;

        return {
          ...prev,
          sections: updatedSections,
        };
      } else {
        const { sectionId, assignmentIndex, newValue } = params;
        const updatedAssignments = {
          ...prev.assignments,
          [sectionId]: [...(prev.assignments[sectionId] || [])],
        };
        updatedAssignments[sectionId][assignmentIndex].name = newValue;

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
          params.direction === "up"
            ? params.sectionIndex - 1
            : params.sectionIndex + 1;
        if (target < 0 || target >= sections.length) return prev;
        [sections[params.sectionIndex], sections[target]] = [
          sections[target],
          sections[params.sectionIndex],
        ];
        return { ...prev, sections };
      } else {
        const { sectionId, assignmentIndex, direction } = params;
        const assignments = { ...prev.assignments };
        const list = [...(assignments[sectionId] || [])];
        const target =
          direction === "up" ? assignmentIndex - 1 : assignmentIndex + 1;
        if (target < 0 || target >= list.length) return prev;
        [list[assignmentIndex], list[target]] = [
          list[target],
          list[assignmentIndex],
        ];
        assignments[sectionId] = list;
        return { ...prev, assignments };
      }
    });
  };

  const removeItem = (params: RemoveItemParams) => {
    setFactionRegistry((prev) => {
      if (params.type === "section") {
        const wasTeam = prev.sections.find(
          (s) => s.id === params.sectionId
        )?.isTeam;
        const sections = prev.sections.filter((s) => s.id !== params.sectionId);

        const updatedAssignments: Record<string, Assignment[]> = {};
        sections.forEach((section) => {
          if (section.id in prev.assignments) {
            updatedAssignments[section.id] = prev.assignments[section.id];
          }
        });

        const updatedSections = sections.map((s, i) => ({
          ...s,
          isTeam: wasTeam ? i === 0 : s.isTeam,
        }));

        return {
          ...prev,
          sections: updatedSections,
          assignments: updatedAssignments,
        };
      } else {
        const { sectionId, assignmentId } = params;
        const wasTeam = prev.assignments[sectionId]?.find(
          (a) => a.id === assignmentId
        )?.isTeam;

        const updatedList = prev.assignments[sectionId].filter(
          (a) => a.id !== assignmentId
        );

        const updatedAssignments = {
          ...prev.assignments,
          [sectionId]: updatedList.map((a, i) => ({
            ...a,
            isTeam: wasTeam ? i === 0 : a.isTeam,
          })),
        };

        const hasSections = prev.sections.length > 0;

        const updatedSections = hasSections
          ? prev.sections.map((s, i) => ({
              ...s,
              isTeam: false,
            }))
          : [];

        return {
          ...prev,
          sections: updatedSections,
          assignments: updatedAssignments,
        };
      }
    });
  };

  const addItem = (params: AddItemParams) => {
    if (shakeFirstEmpty()) return;

    setFactionRegistry((prev) => {
      if (params.type === "section") {
        if (prev.sections.length >= MAX_CATEGORIES) return prev;

        const isFirstSection = prev.sections.length === 0;
        const newSectionId = generateId();

        if (isFirstSection) {
          setTeam({ sectionId: newSectionId });
        }

        return {
          ...prev,
          sections: [
            ...prev.sections,
            {
              id: newSectionId,
              name: "",
              isTeam: isFirstSection,
            },
          ],
        };
      } else {
        const sectionId = params.sectionId;
        const list = prev.assignments[sectionId] || [];
        if (list.length >= MAX_CATEGORIES) return prev;

        return {
          ...prev,
          assignments: {
            ...prev.assignments,
            [sectionId]: [
              ...list,
              {
                id: generateId(),
                name: "",
                isTeam: false,
              },
            ],
          },
        };
      }
    });
  };

  const shakeFirstEmpty = (): boolean => {
    const sectionIndex = factionRegistry.sections.findIndex(
      (s) => s.name.trim() === ""
    );
    if (sectionIndex !== -1) {
      setShakingIndex({ type: "section", index: sectionIndex });
      setTimeout(() => setShakingIndex(null), 500);
      return true;
    }
    for (const sectionId of Object.keys(factionRegistry.assignments)) {
      const i = factionRegistry.assignments[sectionId].findIndex(
        (x) => x.name.trim() === ""
      );
      if (i !== -1) {
        setShakingIndex({ type: "assignment", index: i, sectionId });
        setTimeout(() => setShakingIndex(null), 500);
        return true;
      }
    }
    return false;
  };

  const isShaking = (
    type: "section" | "assignment",
    index: number,
    sectionId?: string
  ) => {
    if (!shakingIndex) return false;
    if (type === "section") {
      return shakingIndex.type === "section" && shakingIndex.index === index;
    } else {
      return (
        shakingIndex.type === "assignment" &&
        shakingIndex.index === index &&
        shakingIndex.sectionId === sectionId
      );
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <h3 className="text-xl text-light">Faction Registry</h3>
      <span className="text-base text-zinc-400 italic">
        If you are too lazy to read this now, just continue.
      </span>
      <p className="text-light">
        Set up how you want players to join and be organized in your faction.
      </p>
      <p className="text-light">
        Chill - you will be able to change the structure later.
      </p>
      <p className="text-light">
        The checkbox lets you mark one section or assignment as the{" "}
        <strong>Team</strong>. Basically, the players share the same "workspace"
        and are able to interact with each other on team chats if they are under
        the same team in the section tree.
      </p>

      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-[48%]">
          <h4 className="text-light text-sm mb-3">Sections</h4>
          <div className="flex flex-col gap-2">
            {factionRegistry.sections.map((cat, i) => (
              <EditableItem
                key={`section-${cat.id}`}
                value={cat.name}
                onChange={(val) =>
                  updateItem({
                    type: "section",
                    sectionIndex: i,
                    newValue: val,
                  })
                }
                onRemove={() =>
                  removeItem({ type: "section", sectionId: cat.id })
                }
                onMoveUp={() =>
                  moveItem({
                    type: "section",
                    direction: "up",
                    sectionIndex: i,
                  })
                }
                onMoveDown={() =>
                  moveItem({
                    type: "section",
                    direction: "down",
                    sectionIndex: i,
                  })
                }
                canMoveUp={i > 0}
                canMoveDown={i < factionRegistry.sections.length - 1}
                isShaking={isShaking("section", i)}
                isTeam={cat.isTeam}
                onToggleTeam={(checked) => {
                  if (
                    team?.sectionId === cat.id &&
                    team?.assignmentId === undefined
                  )
                    return;
                  if (!checked) return;

                  setFactionRegistry((prev) => {
                    const updatedSections = prev.sections.map((section) => {
                      if (
                        team?.assignmentId === undefined &&
                        section.id === team?.sectionId
                      ) {
                        return { ...section, isTeam: false };
                      }
                      if (section.id === cat.id) {
                        return { ...section, isTeam: true };
                      }
                      return section;
                    });

                    const updatedAssignments = { ...prev.assignments };
                    if (team?.assignmentId !== undefined) {
                      updatedAssignments[team.sectionId] = updatedAssignments[
                        team.sectionId
                      ].map((asmt) =>
                        asmt.id === team.assignmentId
                          ? { ...asmt, isTeam: false }
                          : asmt
                      );
                    }

                    return {
                      ...prev,
                      sections: updatedSections,
                      assignments: updatedAssignments,
                    };
                  });

                  setTeam({ sectionId: cat.id });
                }}
              />
            ))}
            {factionRegistry.sections.length < MAX_CATEGORIES && (
              <button
                onClick={() => addItem({ type: "section" })}
                className="action-text text-sm"
              >
                + Add section
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-[48%]">
          <h4 className="text-light text-sm mb-3">Assignments</h4>
          <div>
            {factionRegistry.sections.map((s) => (
              <div key={s.id}>
                <p className="text-light text-sm mb-1">{s.name}</p>
                <div className="flex flex-col gap-2">
                  {(factionRegistry.assignments[s.id] || []).map((a, i) => (
                    <EditableItem
                      key={`assignments-${a.id}`}
                      value={a.name}
                      onChange={(val) =>
                        updateItem({
                          type: "assignment",
                          assignmentIndex: i,
                          newValue: val,
                          sectionId: s.id,
                        })
                      }
                      onRemove={() =>
                        removeItem({
                          type: "assignment",
                          assignmentId: a.id,
                          sectionId: s.id,
                        })
                      }
                      onMoveUp={() =>
                        moveItem({
                          type: "assignment",
                          assignmentIndex: i,
                          direction: "up",
                          sectionId: s.id,
                        })
                      }
                      onMoveDown={() =>
                        moveItem({
                          type: "assignment",
                          assignmentIndex: i,
                          direction: "down",
                          sectionId: s.id,
                        })
                      }
                      canMoveUp={i > 0}
                      canMoveDown={
                        i < factionRegistry.assignments[s.id].length - 1
                      }
                      isShaking={isShaking("assignment", i, s.id)}
                      isTeam={
                        team?.sectionId === s.id && team.assignmentId === a.id
                      }
                      onToggleTeam={(checked) => {
                        if (!checked) return;
                        if (
                          team?.sectionId === s.id &&
                          team.assignmentId === a.id
                        )
                          return;

                        setFactionRegistry((prev) => {
                          const updatedSections = prev.sections.map(
                            (section) => {
                              if (
                                team?.assignmentId === undefined &&
                                team?.sectionId === section.id
                              ) {
                                return { ...section, isTeam: false };
                              }
                              return section;
                            }
                          );

                          const updatedAssignments = { ...prev.assignments };

                          if (team?.assignmentId !== undefined) {
                            updatedAssignments[team.sectionId] =
                              updatedAssignments[team.sectionId].map((asmt) => {
                                if (asmt.id === team.assignmentId) {
                                  return { ...asmt, isTeam: false };
                                }
                                return asmt;
                              });
                          }

                          updatedAssignments[s.id] = updatedAssignments[
                            s.id
                          ].map((asmt) => {
                            if (asmt.id === a.id) {
                              return { ...asmt, isTeam: true };
                            }
                            return asmt;
                          });

                          return {
                            ...prev,
                            sections: updatedSections,
                            assignments: updatedAssignments,
                          };
                        });

                        setTeam({ sectionId: s.id, assignmentId: a.id });
                      }}
                    />
                  ))}
                  {(factionRegistry.assignments[s.id] || []).length <
                    MAX_CATEGORIES &&
                    s.name.trim() !== "" && (
                      <button
                        onClick={() =>
                          addItem({ type: "assignment", sectionId: s.id })
                        }
                        className="action-text text-sm"
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

      <ModalNavButtons className="mt-10">
        <Button className="w-[150px]" onClick={prevStep}>
          Back
        </Button>
        <Button
          className="w-[150px]"
          onClick={() =>
            // unassigned will be added as a leaf to the first level of the tree with an id of '0'
            shakeFirstEmpty() ? null : nextStep()
          }
        >
          Continue
        </Button>
      </ModalNavButtons>
    </div>
  );
};
