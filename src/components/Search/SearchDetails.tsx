import { type FC } from 'react';

type SearchDetailsProps = {
  name: string;
  url: string;
};

const SearchDetails: FC<SearchDetailsProps> = ({ name, url }) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>URL: {url}</h2>
    </div>
  );
};

export default SearchDetails;
