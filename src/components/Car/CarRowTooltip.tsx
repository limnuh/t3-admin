import { type CustomTooltipProps } from 'ag-grid-react';
import React, { type FC } from 'react';
import type { History, CarUpload } from '~/pages/api/scraper';

const CarRowTooltip: FC<CustomTooltipProps<CarUpload>> = ({ data }) => {
  type CarKeys = keyof History;
  const historyKeys = new Set<CarKeys>();
  if (!data?.history.length || !data) return null;
  data.history.forEach((historyObject) => Object.keys(historyObject).forEach((key) => historyKeys.add(key as CarKeys)));
  historyKeys.delete('createdAt');

  return (
    <table className="w-full table-auto bg-white dark:bg-boxdark">
      <thead>
        <tr className="bg-gray-2 text-left dark:bg-meta-4">
          <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Date</th>
          {[...historyKeys].map((key) => (
            <th key={key} className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              {String(data?.[key])}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.history?.map((historyObject) => (
          <tr key={String(historyObject.createdAt)}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <p className="text-black dark:text-white">{historyObject.createdAt.toISOString().split('T')[0]}</p>
            </td>
            {[...historyKeys].map((key) => (
              <td key={key} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">{String(historyObject?.[key])}</p>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CarRowTooltip;
