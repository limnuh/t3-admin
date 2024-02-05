import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useState, type FC, useMemo } from 'react';
import type { CarUpload } from '~/pages/api/scraper';
import CarRowTooltip from './CarRowTooltip';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

type CarListProps = {
  searchList: CarUpload[];
};

const CarList: FC<CarListProps> = ({ searchList }) => {
  const [rowData, setRowData] = useState(searchList);

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      tooltipComponent: CarRowTooltip,
    };
  }, []);

  const [colDefs, setColDefs] = useState<ColDef<CarUpload>[]>([
    {
      valueGetter: (params) => params.data?.history[0]?.createdAt.toISOString().replace('T', ' ').split('.')[0],
      headerName: 'Last changed',
      // cellRenderer: CarHistoryCell,
      field: 'history',
      tooltipField: 'history',
    },
    {
      field: 'title',
      cellRenderer: (params: ICellRendererParams<CarUpload, JSX.Element>) => (
        <a target="_blank" href={params.data?.link || ''}>
          {params.value || ''}
        </a>
      ),
    },
    { field: 'description' },
    { field: 'price' },
    { field: 'inactivePrice', headerName: 'Old price' },
    { field: 'distance' },
    { field: 'km' },
    { field: 'year' },
    { field: 'deleted' },
    { field: 'createdAt' },
    { field: 'updatedAt' },
  ]);

  return (
    <div className=" bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} defaultColDef={defaultColDef} />
      </div>
    </div>
  );
};

export default CarList;
