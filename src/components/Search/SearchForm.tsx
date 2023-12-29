import { useState, type FC, type ChangeEventHandler } from 'react';
import { type searchData } from './SearchList';

type SearchFormProps = {
  editedItem: searchData | null;
  onCancel: () => void;
  onSave: (data: searchData) => void;
};

const SearchForm: FC<SearchFormProps> = ({ editedItem, onCancel, onSave }) => {
  const [searchItem, setSearchItem] = useState(editedItem);
  if (!searchItem) return null;

  const onChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value, name } }) => {
    setSearchItem({ ...searchItem, [name]: value });
  };

  return (
    <div className="p-7">
      <form action="#">
        <div className="mb-5.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="searchName">
            Car search name
          </label>
          <div className="relative">
            <input
              className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="text"
              name="searcName"
              id="searchName"
              onChange={onChange}
              value={searchItem?.name || ''}
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
              value={searchItem?.url || ''}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4.5">
          <button
            className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:shadow-1"
            type="button"
            onClick={() => onSave(searchItem)}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
