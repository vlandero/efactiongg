'use client';

import { trpc } from "../../_trpc/client";

export default function Registry() {
  const { data, isLoading } = trpc.test.getOrgById.useQuery({ id: '12' });

  return (
    <div>
      <h1>Org Info</h1>
      {isLoading ? <p>Loading...</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
