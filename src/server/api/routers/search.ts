import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const searchRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const serach = await ctx.prisma.search.findUnique({
      where: { id: input.id },
    });

    if (!serach) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Search not found',
      });
    }

    return serach;
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.search.findMany();
  }),

  getRunningSearches: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.search.findMany({ where: { status: 'RUN' } });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        url: z.string().min(1).max(5000),
        status: z.enum(['NEW', 'RUN', 'END']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.search.create({
        data: {
          name: input.name,
          url: input.url,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(255).optional(),
        url: z.string().min(1).max(5000).optional(),
        status: z.enum(['NEW', 'RUN', 'END']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.search.update({
        where: {
          id: input.id,
        },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.url && { url: input.url }),
          ...(input.status && { status: input.status }),
        },
      });
    }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.search.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
