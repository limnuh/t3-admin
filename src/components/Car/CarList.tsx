import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';
import { type CarUpload } from '~/pages/api/scraper';

type CarListProps = {
  searchList: CarUpload[];
};

const CarList: FC<CarListProps> = ({ searchList }) => {
  return (
    <div className=" bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        {!searchList || searchList.length === 0 ? (
          <div>There is no data</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">Image</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Title</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Price</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Extra Data</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Dates</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">History</th>
              </tr>
            </thead>
            <tbody>
              {searchList?.map((car) => (
                <tr key={car.id}>
                  <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      <Image src={car.image} alt={car.title} width={118} height={88} />
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      <Link href={car.link} className={`${car.deleted ? 'line-through' : ''}`}>
                        {car.title}
                      </Link>
                    </p>
                    {car.extraData}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                      {car.price}
                    </p>
                    <p className="text-black whitespace-nowrap dark:text-white">{car.createdAt?.toISOString()}</p>
                    <p className="text-black whitespace-nowrap dark:text-white">{car.updatedAt?.toISOString()}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"></td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{car.distance}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <pre className="text-black dark:text-white">{JSON.stringify(car.history, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CarList;
