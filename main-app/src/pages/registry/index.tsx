import { dummyFactionRegistry } from "@/dummyData";
import { FactionRegistryFull } from "@/models/DB/FactionRegistry.model";
import React, { JSX } from "react";

type Props = {
  data?: FactionRegistryFull;
};

const Registry: React.FC<Props> = ({ data = dummyFactionRegistry }) => {
  const registry = data.registry;
  const players = data.players;

  const getPlayers = (sectionPath: string[], assignmentId: string) => {
    return players.filter(
      (p) =>
        JSON.stringify(p.sectionPath) === JSON.stringify(sectionPath) &&
        p.assignmentId === assignmentId
    );
  };

  const renderSectionLevel = (
    sectionIndex: number,
    path: string[] = []
  ): JSX.Element[] => {
    if (sectionIndex >= registry.sections.length) return [];

    const currentSection = registry.sections[sectionIndex];

    const currentKeys = Array.from(
      new Set(
        players
          .filter((p) =>
            path.every((v, i) => p.sectionPath[i] === v)
          )
          .map((p) => p.sectionPath[sectionIndex])
          .filter((v): v is string => typeof v === "string")
      )
    );

    return currentKeys.map((key) => {
      const newPath = [...path, key];

      return (
        <div
          key={key}
          className="rounded-2xl m-2 min-w-[250px] flex-1"
        >
          <h3 className={`mb-3 font-bold text-primary text-center ${["text-3xl", "text-2xl", "text-xl", "text-lg", "text-base"][sectionIndex] || "text-base"
            }`}>{key}</h3>

          {registry.assignments[currentSection.id]?.map((assignment) => {
            const assignedPlayers = getPlayers(newPath, assignment.id);
            if (assignedPlayers.length === 0) return null;

            return (
              <div key={assignment.id} className="mb-3">
                <p className="text-xl font-semibold text-accent mb-1 text-center">
                  {assignment.name}
                </p>
                <ul className="space-y-1 text-center">
                  {assignedPlayers.map((p) => (
                    <li
                      key={p.user.id}
                      className="text-m"
                    >
                      {p.user.username}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="flex flex-wrap gap-4 mt-4">
            {renderSectionLevel(sectionIndex + 1, newPath)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen p-6 bg-neutral-900 text-white">
      <div className="flex flex-wrap gap-6 justify-center">
        {renderSectionLevel(0)}
      </div>
    </div>
  );
};

export default Registry;
