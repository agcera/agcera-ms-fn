import { Box, Typography, useTheme } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect, useState } from 'react';
import { MdAnalytics } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLegend, VictoryPie, VictoryTheme } from 'victory';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import { getAnalytics, selectAllanalytics } from '../redux/analyticsSlice';
import { selectLoggedInUser } from '../redux/usersSlice';
import { tokens } from '../themeConfig';

const data = [
  { day: 1, earnings: 13000 },
  { day: 2, earnings: 16500 },
  { day: 3, earnings: 14250 },
  { day: 4, earnings: 19000 },
  { day: 5, earnings: 13000 },
  { day: 6, earnings: 16500 },
  { day: 7, earnings: 14250 },
];
function LinearProgressWithLabel({ title, value, ...props }) {
  return (
    <Box className="w-full px-4 py-1 flex flex-col gap-1">
      <Box className="flex justify-between">
        <Typography variant="body2">{title}</Typography>
        <Typography variant="body2" className="font-medium">
          {value}%
        </Typography>
      </Box>
      <LinearProgress variant="determinate" color="secondary" value={value} {...props} />
    </Box>
  );
}

const SmallBox = ({ bg, color, number, text, icon }) => {
  return (
    <Box className={`${bg} w-full flex-col justify-between p-3`}>
      {icon && <icon className="mb-2" />} {/* Conditionally render icon if it's provided */}
      <MdAnalytics className="mb-2" />
      <Typography variant={`body2 ${color} font-bold text-[14px]`}>{number}</Typography>
      <Typography variant={`body1 text-[14px] ${color} mt-2 font-bold`}>{text}</Typography>
    </Box>
  );
};

function AnalyticsPage() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector(selectLoggedInUser);
  const analytics = useSelector(selectAllanalytics);
  const [initLoading, setInitLoading] = useState(true);
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const now = new Date();
    now.setDate(now.getDate() - 7);

    dispatch(
      getAnalytics({ from: now.toLocaleDateString(), to: new Date().toLocaleDateString(), storeId: user.storeId })
    ).then(({ error }) => {
      setInitLoading(false);
      if (error) console.log(error);
    });
  }, [dispatch, user]);

  if (initLoading && !analytics) {
    return (
      <Box className="size-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box className="flex flex-col size-full">
        <PageHeader title="Analytics" hasHeader={true} />
        <Box className="size-full flex justify-center">
          <Typography variant="subHeader" color="secondary.light" className="m-auto font-normal">
            No analytics available
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="size-full flex flex-col">
      <PageHeader title="Analytics" hasHeader={true} />
      <Box className="size-full flex flex-col md:flex-row px-4 overflow-auto">
        <Box className="">
          {/* small boxes */}
          <Box className="flex justify-between">
            <SmallBox
              bg="bg-[#FFD0EF]"
              number={analytics.usersCount}
              text="Total Users"
              color="text-black"
              icon={<MdAnalytics />}
            />
            <SmallBox
              bg="bg-background"
              number={analytics.productsCount}
              text="Product Types"
              color="text-black"
              icon={<MdAnalytics />}
            />
            <SmallBox
              bg="bg-primary"
              number={analytics.storeCount}
              text="Total Stores"
              color="text-white"
              icon={<MdAnalytics />}
            />
          </Box>

          {/* bar chart */}
          <Box className="">
            {/* <Typography className="mb-[-10px] font-bold">
              {user.role === 'admin' ? 'All Sales' : `Sales for your store`}
            </Typography> */}
            <Box className="h-full">
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{ x: 40, y: 80 }}
                // animate={{ duration: 1000, easing: 'circleOut' }}
                width={1000}
                height={500}
              >
                <VictoryLegend
                  x={400}
                  y={50}
                  title="All sales"
                  centerTitle
                  // orientation="horizontal"
                  // gutter={20}
                  style={{ title: { fontSize: 30, fontWeight: 'bold' } }}
                  data={[]}
                />
                <VictoryAxis
                  tickValues={[1, 2, 3, 4, 5, 6, 7]}
                  tickFormat={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
                />
                <VictoryAxis dependentAxis tickFormat={(x) => `$${x / 1000}k`} />
                <VictoryBar
                  alignment="middle"
                  data={data}
                  barWidth={40}
                  style={{
                    data: { fill: colors.primary.main },
                  }}
                  x="day"
                  y="earnings"
                  animate
                />
              </VictoryChart>
            </Box>
          </Box>

          {/* progress bars */}
          <Typography className="text-center font-medium my-2 mt-8">Best Shops To sell its Products</Typography>
          <Box className="flex w-full">
            <Box className="flex flex-col gap-1 w-full">
              <LinearProgressWithLabel value={40} title="shop 1" />
              <LinearProgressWithLabel value={80} title="shop 2" />
              <LinearProgressWithLabel value={15} title="shop 3" />
            </Box>
            <Box className="flex flex-col gap-1 w-full">
              <LinearProgressWithLabel value={25} title="shop 4" />
              <LinearProgressWithLabel value={70} title="shop 5" />
              <LinearProgressWithLabel value={40} title="shop 6" />
            </Box>
          </Box>
        </Box>

        <Box className="overflow-auto flex flex-col">
          <Typography className="text-center font-semibold -mb-16">Best selling products</Typography>
          <VictoryPie
            animate={{ duration: 1000, easing: 'bounceInOut' }}
            colorScale={['tomato', 'orange', 'gold', 'cyan', 'navy']}
            width={400}
            height={400}
            data={[
              { x: 'Agcera', y: 10 },
              { x: 'UnoProducto', y: 35 },
              { x: 'DuoProducto', y: 40 },
              { x: 'TrioProducto', y: 15 },
            ]}
            theme={VictoryTheme.material}
            innerRadius={120}
            labelRadius={100}
            padAngle={1}
          />
          {/* <VictoryLegend
            x={400}
            y={50}
            title="All sales"
            centerTitle
            // orientation="horizontal"
            // gutter={20}
            style={{ title: { fontSize: 30, fontWeight: 'bold' } }}
            data={[]}
          /> */}
        </Box>
      </Box>
    </Box>
  );
}

export default AnalyticsPage;
