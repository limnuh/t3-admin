import Link from 'next/link';
import { type FC } from 'react';

type SearchDetailsProps = {
  name: string;
  url: string;
  searchCount: number;
};

const SearchDetails: FC<SearchDetailsProps> = ({ name, url, searchCount }) => {
  return (
    <div className="flex justify-between gap-4.5">
      <h2 className="font-normal text-2xl text-black dark:text-white">
        {name}{' '}
        <Link className="underline" href={url}>
          URL
        </Link>
        {!!searchCount && ` | Count: ${searchCount}`}
      </h2>
    </div>
  );
};

export default SearchDetails;
