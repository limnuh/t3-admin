import { type GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { type FC } from 'react';
import { LoaderIcon } from 'react-hot-toast';
import Breadcrumb from '~/components/Breadcrumb';
import CarList from '~/components/Car/CarList';
import SearchDetails from '~/components/Search/SearchDetails';
import DefaultLayout from '~/layout/DefaultLayout';
import { ssg } from '~/server/helpers/ssgHelper';
import { api } from '~/utils/api';
import type { CarUpload, History } from '../api/scraper';
import type { JsonObject } from '@prisma/client/runtime/library';
import ChartOne from '~/components/Examples/ChartOne';

type SearchDetailsPageProps = {
  id: string;
};

const SearchDetailsPage: FC<SearchDetailsPageProps> = ({ id }) => {
  const { isLoading: isLoadingSearch, data, isError: isErrorSearch } = api.search.getById.useQuery({ id });
  const {
    isLoading: isLoadingCars,
    data: carData,
    isError: isErrorCars,
  } = api.car.getBySearchId.useQuery({ searchId: id });
  const {
    isLoading: isLoadingAggregatedSearchData,
    data: aggregatedSearchData,
    isError: isErrorAggregatedSearchData,
  } = api.aggregatedSearchData.getBySearchId.useQuery({ searchId: id });
  const isLoading = isLoadingCars || isLoadingSearch;
  const isError = isErrorCars || isErrorSearch;

  const cars: CarUpload[] = (carData || [])
    .map((car) => {
      const historyObjectArray = car.history as JsonObject[];
      const history: History[] = historyObjectArray.map(
        ({
          link,
          title,
          description,
          image,
          price,
          inactivePrice,
          extraData,
          distance,
          km,
          year,
          deleted,
          createdAt,
        }): History => ({
          ...(link ? { link: String(link) } : {}),
          ...(title ? { title: String(title) } : {}),
          ...(description ? { description: String(description) } : {}),
          ...(image ? { image: String(image) } : {}),
          ...(extraData ? { extraData: String(extraData) } : {}),
          ...(price || Number(price) === 0 ? { price: Number(price) } : {}),
          ...(inactivePrice || Number(inactivePrice) === 0 ? { inactivePrice: Number(inactivePrice) } : {}),
          ...(distance || Number(distance) === 0 ? { distance: Number(distance) } : {}),
          ...(year || Number(year) === 0 ? { year: Number(year) } : {}),
          ...(km || Number(km) === 0 ? { km: Number(km) } : {}),
          ...(typeof deleted === 'boolean' ? { deleted } : {}),
          createdAt: new Date(String(createdAt)),
        })
      );
      return { ...car, history } as CarUpload;
    })
    .sort((a, b) => {
      return new Date(b?.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
    });

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Link href={'/search'} className="mb-4">
          {'< '}Back
        </Link>
        <Breadcrumb pageName="Search Details" />
        {isError ? (
          <div>Error</div>
        ) : isLoading ? (
          <LoaderIcon />
        ) : (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              {isLoadingSearch || !data ? (
                <LoaderIcon />
              ) : (
                <SearchDetails name={data.name} searchCount={cars?.length ?? 0} url={data.url} />
              )}
            </div>
            {isLoadingCars || !cars ? <LoaderIcon className="m-6" /> : <CarList searchList={cars} />}
          </div>
        )}
        {isErrorAggregatedSearchData ? (
          <div>Error</div>
        ) : isLoadingAggregatedSearchData || !aggregatedSearchData ? (
          <LoaderIcon />
        ) : (
          <div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
              <ChartOne
                series={aggregatedSearchData.countChartData.series}
                categories={aggregatedSearchData.countChartData.categories}
                title="Count"
              />
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
              <ChartOne
                series={aggregatedSearchData.pricePercentilesChartData.series}
                categories={aggregatedSearchData.pricePercentilesChartData.categories}
                title="Price"
              />
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
              <ChartOne
                series={aggregatedSearchData.kmPercentilesChartData.series}
                categories={aggregatedSearchData.kmPercentilesChartData.categories}
                title="Km"
              />
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext<{ searchId: string }>) {
  const id = context.params?.searchId ?? '';
  await ssg.search.getById.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default SearchDetailsPage;
