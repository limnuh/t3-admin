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
      flex: 1,
      filter: true,
      tooltipComponent: CarRowTooltip,
    };
  }, []);

  const [colDefs, setColDefs] = useState<ColDef<CarUpload>[]>([
    { field: 'deleted', headerName: '🗑️', minWidth: 70 },
    { field: 'price', minWidth: 100 },
    {
      valueGetter: (params) => params.data?.history[0]?.createdAt.toISOString().split('T')[0],
      headerName: 'Last changed',
      field: 'history',
      tooltipField: 'history',
      minWidth: 120,
    },

    {
      field: 'createdAt',
      headerName: 'Created',
      type: 'date',
      minWidth: 120,
    },
    { field: 'km', minWidth: 90 },
    { field: 'year', minWidth: 80 },
    {
      field: 'title',
      cellRenderer: (params: ICellRendererParams<CarUpload, JSX.Element>) => (
        <a target="_blank" href={params.data?.link || ''}>
          {params.value || ''}
        </a>
      ),
      tooltipField: 'title',
      tooltipComponentParams: 'image',
      minWidth: 300,
    },
    { field: 'description', minWidth: 150 },
    { field: 'distance', headerName: 'Dist', minWidth: 80 },
    { field: 'updatedAt', headerName: 'Updated', minWidth: 120 },
    { field: 'inactivePrice', headerName: 'Old', minWidth: 100 },
  ]);

  return (
    <div className=" bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          suppressDragLeaveHidesColumns={true}
          tooltipShowDelay={0}
        />
      </div>
    </div>
  );
};

export default CarList;
