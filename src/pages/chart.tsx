import Breadcrumb from '../components/Breadcrumb';
import ChartFour from '../components/Examples/ChartFour';
import ChartThree from '../components/Examples/ChartThree';
import ChartTwo from '../components/Examples/ChartTwo';
import DefaultLayout from '../layout/DefaultLayout';

const Chart = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
          <ChartFour />
        </div>
        <ChartTwo />
        <ChartThree />
      </div>
    </DefaultLayout>
  );
};

export default Chart;
