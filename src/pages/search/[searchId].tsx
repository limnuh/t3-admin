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
  const { isLoading: isLoadingSearch, data, isError } = api.search.getById.useQuery({ id });
  const [results, setResults] = useState<scrapeResponse>(apiDefaultData);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const updateSearchList = async () => {
    const result: AxiosResponse<scrapeResponse> = await axios.get(scraperUrl + data?.url);
    if (result.status === 200) return setResults(result.data);
    setResults(apiDefaultData);
  };

  const manualSearch = () => {
    setIsLoadingResults(true);
    updateSearchList()
      .then(() => {
        setIsLoadingResults(false);
      })
      .catch(() => {
        setIsLoadingResults(false);
      });
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Link href={'/search'} className="mb-4">
          {'< '}Back
        </Link>
        <Breadcrumb pageName="Search Details" />
        {isError ? (
          <div>Error</div>
        ) : isLoadingSearch ? (
          <LoaderIcon />
        ) : (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <SearchDetails
                name={data.name}
                searchCount={results.data?.totalCount}
                url={data.url}
                onSearch={manualSearch}
              />
            </div>
            {isLoadingResults ? <LoaderIcon className="m-6" /> : <CarList searchList={results.data?.cars} />}
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
