import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const aggregatedSearchDataRouter = createTRPCRouter({
  getBySearchId: publicProcedure.input(z.object({ searchId: z.string() })).query(async ({ ctx, input }) => {
    const aggregatedSearchData = await ctx.prisma.agregatedSearchData.findMany({
      where: { searchId: input.searchId },
    });

    if (!aggregatedSearchData) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Search not found',
      });
    }

    return aggregatedSearchData;
  }),

  create: protectedProcedure
    .input(
      z.object({
        searchId: z.string(),
        count: z.number(),
        pricePercentiles: z.array(z.number()),
        yearPercentiles: z.array(z.number()),
        kmPercentiles: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.agregatedSearchData.create({
        data: {
          searchId: input.searchId,
          count: input.count,
          pricePercentiles: input.pricePercentiles,
          yearPercentiles: input.yearPercentiles,
          kmPercentiles: input.kmPercentiles,
        },
      });
    }),
});
