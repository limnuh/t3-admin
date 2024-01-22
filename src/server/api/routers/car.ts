import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const carRouter = createTRPCRouter({
  getByIds: publicProcedure.input(z.object({ ids: z.array(z.string()) })).query(async ({ ctx, input }) => {
    const cars = await ctx.prisma.car.findMany({
      where: {
        id: {
          in: input.ids,
        },
      },
    });

    if (!cars) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Car not found',
      });
    }
    return cars;
  }),

  getBySearcIds: publicProcedure.input(z.object({ searchId: z.string() })).query(async ({ ctx, input }) => {
    const cars = await ctx.prisma.car.findMany({
      where: {
        searchId: input.searchId,
      },
    });

    if (!cars) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Car not found',
      });
    }
    return cars;
  }),

  createMany: publicProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            id: z.string().min(1).max(255),
            searchId: z.string().min(1).max(255),
            link: z.string().min(1).max(2000),
            title: z.string().min(1).max(2000),
            description: z.string().min(1).max(2000),
            image: z.string().min(1).max(2000),
            extraData: z.string().min(1).max(2000),
            price: z.number().min(0).max(1000000000),
            inactivePrice: z.number(),
            distance: z.number().min(0).max(1000),
            km: z.number().min(0).max(1000000),
            year: z.number().min(0).max(4000),
            deleted: z.boolean().optional(),
            history: z.array(z.any()).optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input: { data } }) => {
      return await ctx.prisma.car.createMany({ data });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1).max(255),
        link: z.string().min(1).max(2000).optional(),
        title: z.string().min(1).max(2000).optional(),
        description: z.string().min(1).max(2000).optional(),
        image: z.string().min(1).max(2000).optional(),
        extraData: z.string().min(1).max(2000).optional(),
        price: z.number().min(0).max(1000000000).optional(),
        inactivePrice: z.number().optional(),
        distance: z.number().min(0).max(1000).optional(),
        km: z.number().min(0).max(1000000).optional(),
        year: z.number().min(0).max(4000).optional(),
        deleted: z.boolean().optional(),
        history: z.array(z.any()).optional(),
        updatedAt: z.date().optional(),
      })
    )
    .mutation(
      async ({
        ctx,
        input: {
          id,
          link,
          title,
          description,
          image,
          extraData,
          price,
          inactivePrice,
          distance,
          km,
          year,
          deleted,
          history,
        },
      }) => {
        return await ctx.prisma.car.update({
          where: {
            id,
          },
          data: {
            ...(link && { link }),
            ...(title && { title }),
            ...(description && { description }),
            ...(image && { image }),
            ...(extraData && { extraData }),
            ...(price && { price }),
            ...(inactivePrice && { inactivePrice }),
            ...(distance && { distance }),
            ...(km && { km }),
            ...(year && { year }),
            ...(deleted && { deleted }),
            ...(history && { history }),
          },
        });
      }
    ),
});