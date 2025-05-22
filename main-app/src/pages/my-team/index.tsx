import { dummyFactionRegistry, dummyUser } from "@/dummyData";
import { FactionRegistryFull } from "@/models/DB/FactionRegistry.model";
import { GetServerSideProps } from "next";
import React from "react";
import Registry from "../registry";

const MyTeamPage: React.FC<{ data: FactionRegistryFull }> = ({ data }) => {
  return <Registry data={data} />;
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
