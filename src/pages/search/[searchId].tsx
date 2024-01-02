import { type GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { type FC } from 'react';
import { LoaderIcon } from 'react-hot-toast';
import Breadcrumb from '~/components/Breadcrumb';
import DefaultLayout from '~/layout/DefaultLayout';
import { ssg } from '~/server/helpers/ssgHelper';
import { api } from '~/utils/api';

type SearchDetailsPageProps = {
  id: string;
};

const SearchDetailsPage: FC<SearchDetailsPageProps> = ({ id }) => {
  const res = api.search.getById.useQuery({ id });
  const { isLoading, data, isError } = res;
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Link href={'/search'}>{'< '}Back</Link>
        <Breadcrumb pageName="Search Details" />
        {isError ? (
          <div>Error</div>
        ) : isLoading ? (
          <LoaderIcon />
        ) : (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <div className="flex justify-between gap-4.5">
                <h2 className="font-normal text-2xl text-black dark:text-white">{data.name}</h2>
                <button
                  className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:shadow-1"
                  type="button"
                  // onClick={() => setEditedItem({ name: '', url: '' })}
                >
                  Search
                </button>
              </div>
            </div>
            Ide jön a result lista
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
