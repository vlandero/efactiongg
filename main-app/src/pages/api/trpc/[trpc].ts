import { appRouter } from '@/server/api/root';
import * as trpcNext from '@trpc/server/adapters/next';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
