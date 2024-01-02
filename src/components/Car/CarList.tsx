import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';
import { type result } from '~/pages/search/[searchId]';

type CarListProps = {
  searchList?: result[];
};

const CarList: FC<CarListProps> = ({ searchList }) => {
  return (
    <div className="p-7">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          {!searchList || searchList.length === 0 ? (
            <div>There is no data</div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Image</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Title</th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Price</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Extra Data</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Distance</th>
                </tr>
              </thead>
              <tbody>
                {searchList?.map((car) => (
                  <tr key={car.id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        <Image src={car.image} alt={car.title} width={100} height={100} layout="responsive" />
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        <Link href={car.link}>{car.title}</Link>
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                        {car.price}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{car.extraData}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{car.distance}</p>
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

export default CarList;
