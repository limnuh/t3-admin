import Link from 'next/link';
import { type FC } from 'react';

type SearchDetailsProps = {
  name: string;
  url: string;
  onSearch: () => void;
};

const SearchDetails: FC<SearchDetailsProps> = ({ name, url, onSearch }) => {
  return (
    <div className="flex justify-between gap-4.5">
      <h2 className="font-normal text-2xl text-black dark:text-white">
        {name}{' '}
        <Link className="underline" href={url}>
          URL
        </Link>
      </h2>

      <button
        className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:shadow-1"
        type="button"
        onClick={onSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchDetails;
