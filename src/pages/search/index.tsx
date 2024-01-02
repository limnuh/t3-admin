import SearchForm from '~/components/Search/SearchForm';
import Breadcrumb from '../../components/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import SearchList, { type searchData } from '~/components/Search/SearchList';
import { useEffect, useState } from 'react';
import Modal from '~/components/Modal/Modal';
import { api } from '~/utils/api';
import { LoadingPage } from '~/components/Loading';
import toast from 'react-hot-toast';

const Search = () => {
  const [editedItem, setEditedItem] = useState<searchData | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const ctx = api.useContext();

  useEffect(() => {
    if (editedItem && Object.keys(editedItem)?.length >= 1) setFormOpen(true);
  }, [editedItem]);

  const { data, isLoading: isLoadingList } = api.search.getAll.useQuery();
  const { mutate: remove, isLoading: isLoadingRemove } = api.search.remove.useMutation({
    onSuccess: () => {
      void ctx.search.getAll.invalidate();
      toast.success('You removed new search successfully!');
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.log(errorMessage, e.data);
      if (errorMessage) {
        return toast.error(errorMessage.join(', '));
      }
      toast.error('Failed to remove search. Please try again later!');
    },
  });
  const isLoading = isLoadingList || isLoadingRemove;
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
                onClick={() => setEditedItem({ name: '', url: '' })}
              >
                New search
              </button>
            </div>
          </div>
          <Modal open={formOpen} onClose={() => setFormOpen(false)}>
            <SearchForm editedItem={editedItem} onClose={() => setFormOpen(false)} />
          </Modal>

          <SearchList searchList={data} handleEdit={setEditedItem} handleRemove={(id) => remove({ id })} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Search;
