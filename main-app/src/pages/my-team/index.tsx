import { Registry } from "@/components/Registry";
import { ScheduleTab } from "@/components/TeamPage/ScheduleTab";
import { useUser } from "@/contexts/UserContext";
import { dummyFactionRegistry, dummyUser } from "@/dummyData";
import { FactionRegistryFull } from "@/models/DB/FactionRegistry.model";
import { GetServerSideProps } from "next";
import React, { useState } from "react";

const MyTeamPage: React.FC<{ data: FactionRegistryFull }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('roster');

  const tabs = [
    { id: 'roster', label: 'Players and Registry' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'availability', label: 'Player Availability' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen p-6 bg-neutral-900 text-white">
      <div className="max-w-[1200px] w-[90%] mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-accent mb-2">Team Dashboard</h1>
          <p className="text-neutral-400">Manage your team's activities and performance</p>
        </div>

        <div className="flex border-b border-neutral-700 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-neutral-400 hover:text-white'
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
          {activeTab === 'roster' && (
            <div className="w-[400px] m-auto">
              <Registry data={data} />
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="pb-20">
              <h2 className="text-2xl font-semibold mb-6">Schedule</h2>
              <ScheduleTab />
            </div>
          )}

          {activeTab === 'availability' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Player Availability</h2>
              <div className="text-center py-12 text-neutral-500">
                Availability tracker coming soon
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Team Analytics</h2>
              <div className="text-center py-12 text-neutral-500">
                Match analytics coming soon
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeamPage;

export const getServerSideProps: GetServerSideProps<{
  data: FactionRegistryFull;
}> = async () => {
  const currentUserId = dummyUser.id;
  const registry = dummyFactionRegistry.registry;
  const allPlayers = dummyFactionRegistry.players;

  const currentUserPlayer = allPlayers.find((p) => p.user.id === currentUserId);
  if (!currentUserPlayer) {
    return { notFound: true };
  }

  const teamSection = registry.sections.find((s) => s.isTeam);
  if (!teamSection) {
    return { notFound: true };
  }

  const teamSectionIndex = registry.sections.findIndex((s) => s.isTeam);

  const absoluteTeamPath = currentUserPlayer.sectionPath.slice(
    0,
    teamSectionIndex + 1
  );

  const teamPlayers = allPlayers.filter((player) =>
    absoluteTeamPath.every(
      (pathSegment, i) => player.sectionPath[i] === pathSegment
    )
  );

  const fullRegistry: FactionRegistryFull = {
    registry: {
      sections: registry.sections.slice(teamSectionIndex),
      assignments: { ...registry.assignments },
    },
    players: teamPlayers.map((player) => ({
      ...player,
      sectionPath: player.sectionPath.slice(teamSectionIndex),
    })),
  };

  return {
    props: {
      data: fullRegistry,
    },
  };
};
