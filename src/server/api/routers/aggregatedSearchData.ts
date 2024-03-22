import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

type SeriesItem = {
  name: string;
  data: number[];
};

interface ChartOneData {
  series: [SeriesItem, SeriesItem, SeriesItem, SeriesItem, SeriesItem];
  categories: string[];
}
export interface ChartOneProps {
  series: SeriesItem[];
  categories: string[];
}

export type AggregatedSearchDataType = {
  countChartData: {
    series: [SeriesItem];
    categories: string[];
  };
  pricePercentilesChartData: ChartOneData;
  yearPercentilesChartData: ChartOneData;
  kmPercentilesChartData: ChartOneData;
};

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

    const result: AggregatedSearchDataType = {
      countChartData: {
        series: [
          {
            name: 'Count',
            data: [],
          },
        ],
        categories: [],
      },
      pricePercentilesChartData: {
        series: [
          {
            name: 'Min',
            data: [],
          },
          {
            name: 'Average bottom 50%',
            data: [],
          },
          {
            name: 'Average',
            data: [],
          },
          {
            name: 'Average top 50%',
            data: [],
          },
          {
            name: 'Max',
            data: [],
          },
        ],
        categories: [],
      },
      yearPercentilesChartData: {
        series: [
          {
            name: 'Min',
            data: [],
          },
          {
            name: 'Average bottom 50%',
            data: [],
          },
          {
            name: 'Average',
            data: [],
          },
          {
            name: 'Average top 50%',
            data: [],
          },
          {
            name: 'Max',
            data: [],
          },
        ],
        categories: [],
      },
      kmPercentilesChartData: {
        series: [
          {
            name: 'Min',
            data: [],
          },
          {
            name: 'Average bottom 50%',
            data: [],
          },
          {
            name: 'Average',
            data: [],
          },
          {
            name: 'Average top 50%',
            data: [],
          },
          {
            name: 'Max',
            data: [],
          },
        ],
        categories: [],
      },
    };

    aggregatedSearchData.forEach(({ count, pricePercentiles, yearPercentiles, kmPercentiles, createdAt }) => {
      const formatedDate = dayjs(createdAt).format('MMM-DD H[h]');
      result.countChartData.categories.push(formatedDate);
      result.pricePercentilesChartData.categories.push(formatedDate);
      result.yearPercentilesChartData.categories.push(formatedDate);
      result.kmPercentilesChartData.categories.push(formatedDate);
      result.countChartData.series[0].data.push(count);
      result.pricePercentilesChartData.series[0].data.push(pricePercentiles[0] || 0);
      result.pricePercentilesChartData.series[1].data.push(pricePercentiles[1] || 0);
      result.pricePercentilesChartData.series[2].data.push(pricePercentiles[2] || 0);
      result.pricePercentilesChartData.series[3].data.push(pricePercentiles[3] || 0);
      result.pricePercentilesChartData.series[4].data.push(pricePercentiles[4] || 0);
      result.yearPercentilesChartData.series[0].data.push(yearPercentiles[0] || 0);
      result.yearPercentilesChartData.series[1].data.push(yearPercentiles[1] || 0);
      result.yearPercentilesChartData.series[2].data.push(yearPercentiles[2] || 0);
      result.yearPercentilesChartData.series[3].data.push(yearPercentiles[3] || 0);
      result.yearPercentilesChartData.series[4].data.push(yearPercentiles[4] || 0);
      result.kmPercentilesChartData.series[0].data.push(kmPercentiles[0] || 0);
      result.kmPercentilesChartData.series[1].data.push(kmPercentiles[1] || 0);
      result.kmPercentilesChartData.series[2].data.push(kmPercentiles[2] || 0);
      result.kmPercentilesChartData.series[3].data.push(kmPercentiles[3] || 0);
      result.kmPercentilesChartData.series[4].data.push(kmPercentiles[4] || 0);
    });
    return result;
  }),

  create: publicProcedure
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
