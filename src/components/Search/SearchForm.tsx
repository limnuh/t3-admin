import { useState, type FC, type ChangeEventHandler } from 'react';
import { type searchData } from './SearchList';
import { api } from '~/utils/api';

type SearchFormProps = {
  editedItem: searchData | null;
  onClose: () => void;
};

const SearchForm: FC<SearchFormProps> = ({ editedItem, onClose }) => {
  const [searchItem, setSearchItem] = useState(editedItem);
  if (!searchItem) return null;
  const isNew = (data: searchData) => !data.id;
  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = ({ target: { value, name } }) => {
    setSearchItem({ ...searchItem, [name]: value });
  };

  const ctx = api.useContext();

  const { mutate: mutateNew, isLoading: isLoadingNew } = api.search.create.useMutation({
    onSuccess: () => {
      void ctx.search.getAll.invalidate();
      onClose();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.log(errorMessage, e.data);
      if (errorMessage) {
        // return toast.error(errorMessage.join(', '));
      }
      // toast.error('Failed to post. Please try again later!');
    },
  });

  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } = api.search.update.useMutation({
    onSuccess: () => {
      void ctx.search.getAll.invalidate();
      onClose();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.log(errorMessage, e.data);
      if (errorMessage) {
        // return toast.error(errorMessage.join(', '));
      }
      // toast.error('Failed to post. Please try again later!');
    },
  });

  const isLoading = isLoadingNew || isLoadingUpdate;

  const save = (item: searchData) => {
    if (isNew(item))
      return mutateNew({
        name: item.name ?? '',
        url: item.url ?? '',
      });
    const updatedData = {
      id: item.id ?? '',
      name: item?.name ?? '',
      url: item?.url ?? '',
    };
    mutateUpdate(updatedData);
  };

  return (
    <div className="p-7">
      <form action="#">
        <div className="mb-5.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="name">
            Car search name
          </label>
          <div className="relative">
            <input
              className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="name"
              id="name"
              onChange={onChange}
              value={searchItem?.name ?? ''}
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="url">
            Search url
          </label>
          <div className="relative">
            <textarea
              className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              name="url"
              id="url"
              rows={6}
              onChange={onChange}
              value={searchItem?.url ?? ''}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4.5">
          <button
            className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:shadow-1"
            type="button"
            disabled={isLoading}
            onClick={() => save(searchItem)}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
