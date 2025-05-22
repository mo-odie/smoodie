import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `안녕하세요, ${input.name ?? '익명'}님!`,
      };
    }),

    getUser: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return {
        id: input.id,
      };
    }),
});

export type AppRouter = typeof appRouter; 