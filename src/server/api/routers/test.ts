import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const testRouter = router({
  getOrgById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return {
        id: input.id,
        name: 'Example Org',
      };
    }),
});
