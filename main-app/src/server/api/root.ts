import { router } from './trpc';
import { testRouter } from './routers/test';
import { parseRoflRouter } from './routers/parseRofl';

export const appRouter = router({
  test: testRouter,
  parseRofl: parseRoflRouter
});

export type AppRouter = typeof appRouter;
