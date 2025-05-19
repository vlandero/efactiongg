// server/api/routers/parseRofl.ts
import { z } from "zod";
import { router, publicProcedure } from "@/server/api/trpc";
import fs from "fs/promises";
import { ROFLReader } from "rofl-parser.js";

export const parseRoflRouter = router({
  parse: publicProcedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input }) => {
      const { path } = input;

      try {
        const reader = new ROFLReader(path);
        const metadata = reader.getMetadata();

        await fs.unlink(path);

        return { metadata };
      } catch (err) {
        console.error("Failed to parse:", err);
        return { error: "Could not parse replay" };
      }
    }),
});
