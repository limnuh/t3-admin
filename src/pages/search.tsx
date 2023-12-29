import SearchForm from '~/components/Search/SearchForm';
import Breadcrumb from '../components/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import SearchList, { type searchData } from '~/components/Search/SearchList';
import { useEffect, useState } from 'react';
import Modal from '~/components/Modal/Modal';
import { api } from '~/utils/api';
import { LoadingPage } from '~/components/Loading';

const Search = () => {
  const [editedItem, setEditedItem] = useState<searchData | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (editedItem && Object.keys(editedItem)?.length >= 1) setFormOpen(true);
  }, [editedItem]);

  const { data, isLoading } = api.search.getAll.useQuery();
  if (isLoading) return <LoadingPage />;

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Search" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <div className="flex justify-between gap-4.5">
              <h3 className="font-medium text-black dark:text-white">Car searches</h3>
              <button
                className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:shadow-1"
                type="button"
              >
                New search
              </button>
            </div>
          </div>
          <Modal open={formOpen} onClose={() => setFormOpen(false)}>
            <SearchForm
              editedItem={editedItem}
              onCancel={() => setFormOpen(false)}
              onSave={(item) => console.log(item)}
            />
          </Modal>

          <SearchList searchList={data} handleEdit={setEditedItem} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Search;
