import { createTRPCRouter } from '~/server/api/trpc';
import { searchRouter } from './routers/search';
import { carRouter } from './routers/car';
import { createCallerFactory } from '@trpc/server';
import { aggregatedSearchDataRouter } from './routers/aggregatedSearchData';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  search: searchRouter,
  car: carRouter,
  aggregatedSearchData: aggregatedSearchDataRouter,
});

export const createCaller = createCallerFactory();

// export type definition of API
export type AppRouter = typeof appRouter;
