import axios, { type AxiosResponse } from 'axios';
import { type GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useState, type FC } from 'react';
import { LoaderIcon } from 'react-hot-toast';
import Breadcrumb from '~/components/Breadcrumb';
import CarList from '~/components/Car/CarList';
import SearchDetails from '~/components/Search/SearchDetails';
import DefaultLayout from '~/layout/DefaultLayout';
import { ssg } from '~/server/helpers/ssgHelper';
import { api } from '~/utils/api';
import { type scrapeResponse } from '../api/scraper';

const scraperUrl = '/api/scraper?url=';

type SearchDetailsPageProps = {
  id: string;
};

const apiDefaultData = {
  data: { cars: [], totalCount: 0 },
};

const SearchDetailsPage: FC<SearchDetailsPageProps> = ({ id }) => {
  const { isLoading: isLoadingSearch, data, isError: isErrorSearch } = api.search.getById.useQuery({ id });
  const {
    isLoading: isLoadingCars,
    data: cars,
    isError: isErrorCars,
  } = api.car.getBySearcIds.useQuery({ searchId: id });
  const isLoading = isLoadingCars || isLoadingSearch;
  const isError = isErrorCars || isErrorSearch;

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
