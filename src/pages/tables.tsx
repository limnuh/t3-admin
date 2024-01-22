import Breadcrumb from '../components/Breadcrumb';
import TableOne from '../components/Examples/TableOne';
import TableThree from '../components/Examples/TableThree';
import TableTwo from '../components/Examples/TableTwo';
import DefaultLayout from '../layout/DefaultLayout';

const Tables = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </DefaultLayout>
  );
};

export default Tables;
