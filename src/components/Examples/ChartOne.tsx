import React from 'react';
import dynamic from 'next/dynamic';
import { type SeriesItem } from '~/server/api/routers/aggregatedSearchData';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartOneProps {
  series: SeriesItem[];
  categories: string[];
  title: string;
}

const primaryColors = ['#3C50E0', '#80CAEE', '#FFA500', '#8A2BE2', '#FF6347'];
const secondaryColors = ['#3056D3', '#80CAEE', '#FF5733', '#66FF99', '#FFD700'];

const getMin = (series: SeriesItem[]) => Math.min(...series.map(({ data }) => Math.min(...(data || [0]))));

const getMax = (series: SeriesItem[]) => Math.max(...series.map(({ data }) => Math.max(...(data || [0]))));

const ChartOne: React.FC<ChartOneProps> = ({ series, categories, title }) => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={{
              legend: {
                show: false,
                position: 'top',
                horizontalAlign: 'left',
              },
              colors: primaryColors,
              chart: {
                fontFamily: 'Satoshi, sans-serif',
                height: 335,
                type: 'line',

                toolbar: {
                  show: true,
                },
              },
              title: {
                text: title,
                align: 'left',
              },
              responsive: [
                {
                  breakpoint: 1024,
                  options: {
                    chart: {
                      height: 300,
                    },
                  },
                },
                {
                  breakpoint: 1366,
                  options: {
                    chart: {
                      height: 350,
                    },
                  },
                },
              ],
              stroke: {
                width: [2, 2],
                curve: 'straight',
              },
              // labels: {
              //   show: false,
              //   position: "top",
              // },
              grid: {
                xaxis: {
                  lines: {
                    show: true,
                  },
                },
                yaxis: {
                  lines: {
                    show: true,
                  },
                },
              },
              dataLabels: {
                enabled: false,
              },
              markers: {
                // size: 4,
                // colors: ['#fff'],
                strokeColors: secondaryColors,
                strokeWidth: 3,
                strokeOpacity: 0.9,
                strokeDashArray: 0,
                fillOpacity: 1,
                discrete: [],
                hover: {
                  size: undefined,
                  sizeOffset: 5,
                },
              },
              xaxis: {
                type: 'category',
                categories,
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
              },
              yaxis: {
                title: {
                  style: {
                    fontSize: '0px',
                  },
                },
                min: getMin(series),
                max: getMax(series),
              },
            }}
            series={series}
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
