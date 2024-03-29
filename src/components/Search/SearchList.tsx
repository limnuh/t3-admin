import { type Search } from '@prisma/client';
import Link from 'next/link';
import { type FC } from 'react';

export type searchData = Partial<Search>;

type SearchListProps = {
  searchList?: searchData[];
  handleEdit: (data: searchData) => void;
  handleRemove: (id: string, name: string) => void;
};

const SearchList: FC<SearchListProps> = ({ searchList, handleEdit, handleRemove }) => {
  return (
    <div className="p-7">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          {!searchList || searchList.length === 0 ? (
            <div>There is no data in the db</div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Name</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Updated at</th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchList?.map((item) => (
                  <tr key={item.id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">{item.name}</h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark bg-">
                      <p className="text-black dark:text-white">{item?.updatedAt?.toISOString().split('T')[0]}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full ${
                          item.status === 'NEW'
                            ? 'text-secondary bg-secondary'
                            : item.status === 'END'
                            ? 'text-danger bg-danger'
                            : 'text-success bg-success'
                        } bg-opacity-10 py-1 px-3 text-sm font-medium `}
                      >
                        {item.status}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <Link href={`/search/${item.id}`} className="hover:text-primary">
                          View
                        </Link>
                        <button onClick={() => handleEdit(item)} className="hover:text-primary">
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemove(item.id ?? '', item.name || 'Missing name')}
                          className="hover:text-primary"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchList;
