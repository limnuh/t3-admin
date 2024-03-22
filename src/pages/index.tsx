import CardFour from '~/components/Examples/CardFour';
import CardOne from '~/components/Examples/CardOne';
import CardThree from '~/components/Examples/CardThree';
import CardTwo from '~/components/Examples/CardTwo';
import ChartThree from '~/components/Examples/ChartThree';
import ChartTwo from '~/components/Examples/ChartTwo';
import ChatCard from '~/components/Examples/ChatCard';
import TableOne from '~/components/Examples/TableOne';
import DefaultLayout from '~/layout/DefaultLayout';

const ECommerce = () => {
  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartTwo />
        <ChartThree />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </DefaultLayout>
  );
};

export default ECommerce;
