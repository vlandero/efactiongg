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
          .filter((p) => path.every((v, i) => p.sectionPath[i] === v))
          .map((p) => p.sectionPath[sectionIndex])
          .filter((v): v is string => typeof v === "string")
      )
    );

    return currentKeys.map((key) => {
      const newPath = [...path, key];

      return (
        <div
          key={key}
          className={`m-2 min-w-[280px] flex-1 ${
            sectionIndex === 0
              ? "rounded-2xl bg-white/5 backdrop-blur-lg p-6 shadow-md border border-white/10 hover:shadow-lg transition-shadow"
              : ""
          }`}
        >
          <h3
            className={`mb-3 font-bold text-primary text-center ${
              ["text-3xl", "text-2xl", "text-xl", "text-lg", "text-base"][
                sectionIndex
              ] || "text-base"
            }`}
          >
            {key}
          </h3>

          {registry.assignments[currentSection.id]?.map((assignment) => {
            const assignedPlayers = getPlayers(newPath, assignment.id);
            if (assignedPlayers.length === 0) return null;

            return (
              <div
                key={assignment.id}
                className="mb-4 rounded-lg bg-zinc-800 p-3 shadow-sm border border-white/10 max-w-[300px] m-auto"
              >
                <p className="text-lg font-bold text-accent mb-2 text-center">
                  {assignment.name}
                </p>
                <ul className="space-y-1 text-center">
                  {assignedPlayers.map((p) => (
                    <li
                      key={p.user.id}
                      className="text-sm text-white/90 bg-zinc-700/50 py-1 px-2 rounded-md inline-block cursor-pointer transition-all duration-300 hover:bg-white/10 hover:text-accent hover:scale-105"
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
