import { Box, ButtonBase, Grid, Typography, useTheme } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { MdAnalytics } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
} from 'victory';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import { getAnalytics, selectAllanalytics } from '../redux/analyticsSlice';
import { selectLoggedInUser } from '../redux/usersSlice';
import { tokens } from '../themeConfig';

function LinearProgressWithLabel({ title, value, ...props }) {
  return (
    <Grid item xs={12} md={6} className="px-4 py-1 flex flex-col gap-1">
      <Box className="flex justify-between">
        <Typography variant="body2">{title}</Typography>
        <Typography variant="body2" className="font-medium">
          {Math.round(value)}%
        </Typography>
      </Box>
      <LinearProgress variant="determinate" color="secondary" value={value} {...props} />
    </Grid>
  );
}
function ChoiceButton({ active, children, onClick, ...props }) {
  return (
    <ButtonBase
      className={clsx(
        'min-w-[150px] py-2 px-8 rounded-xl font-semibold text-gray-300',
        active && 'bg-white text-purple'
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </ButtonBase>
  );
}

const SmallBox = ({ bg, color, number, text, Icon }) => {
  return (
    <Box className={`${bg} w-full flex-col justify-between p-3`}>
      {Icon && <Icon className="mb-2" />} {/* Conditionally render icon if it's provided */}
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
  const [dateRange, setDateRange] = useState('weekly');
  const [initLoading, setInitLoading] = useState(true);

  const colors = tokens(theme.palette.mode);

  const pieData = useMemo(() => {
    const data = Object.keys(analytics?.productsSold || {}).map((key) => ({ x: key, y: analytics.productsSold[key] }));
    if (data.length <= 0) return null;
    return data;
  }, [analytics?.productsSold]);
  const chartData = useMemo(() => {
    if (!analytics?.salesByDate) return {};
    // initialize all data columns with zero
    let data = {};
    switch (dateRange) {
      case 'daily': {
        data = { ...Array.from(Array(25), () => 0) };
        delete data[0];
        break;
      }
      case 'weekly': {
        data = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };
        break;
      }
      case 'monthly': {
        const now = new Date();
        now.setMonth(now.getMonth() + 1);
        now.setDate(0);
        data = { ...Array.from(Array(now.getDate() + 1), () => 0) };
        delete data[0];
        break;
      }
    }
    // Fill in the grouped data in their respective columns
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    data = Object.keys(analytics.salesByDate).reduce((acc, curr) => {
      switch (dateRange) {
        case 'daily': {
          const hour = new Date(curr).getHours();
          acc[hour] = acc[hour] + analytics.salesByDate[curr];
          break;
        }
        case 'weekly': {
          const day = weekDays[new Date(curr).getDay()];
          acc[day] = acc[day] + analytics.salesByDate[curr];
          break;
        }
        case 'monthly': {
          const date = new Date(curr).getDate();
          acc[date] = acc[date] + analytics.salesByDate[curr];
          break;
        }
      }
      return acc;
    }, data);
    return data;
  }, [analytics?.salesByDate, dateRange]);
  const chartFormattedData = useMemo(() => {
    return Object.keys(chartData).map((key) => ({ day: key, earnings: chartData[key] }));
  }, [chartData]);

  useEffect(() => {
    let to;
    let from;

    const now = new Date();
    switch (dateRange) {
      case 'daily':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        to = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 23, 59, 59, 999);
        break;
      case 'weekly':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() || 7) + 1, 0, 0, 0, 0);
        to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6, 23, 59, 59, 999);
        break;
      case 'monthly':
        from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        to = new Date(from.getFullYear(), from.getMonth(), 1, 23, 59, 59, 999);
        to.setMonth(to.getMonth() + 1); // Will return the next month
        to.setDate(0); // will set the date to the last date of the current month [Reference]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate#:~:text=If%20you%20specify,month%2C%20May%2031st.
        break;
    }

    dispatch(getAnalytics({ from: from.toLocaleDateString(), to: to.toLocaleDateString() })).then(({ error }) => {
      setInitLoading(false);
      if (error) console.log(error);
    });
  }, [dispatch, user, dateRange]);

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
        <Box className="w-full md:w-[70%] h-max mb-8">
          {/* small boxes */}
          <Box className="flex justify-between">
            <SmallBox
              bg="bg-[#FFD0EF]"
              number={analytics.usersCount || 0}
              text="Total Users"
              color="text-black"
              Icon={MdAnalytics}
            />
            <SmallBox
              bg="bg-background"
              number={analytics.productsCount || 0}
              text="Product Types"
              color="text-black"
              Icon={MdAnalytics}
            />
            <SmallBox
              bg="bg-primary"
              number={analytics.storeCount || 0}
              text="Total Stores"
              color="text-white"
              Icon={MdAnalytics}
            />
          </Box>

          <Box className="flex flex-col md:flex-row gap-2 p-2 bg-gray-100/20 w-full md:w-max rounded-xl mt-4 mx-auto">
            <ChoiceButton
              active={dateRange === 'daily'}
              onClick={() => {
                setDateRange('daily');
              }}
            >
              Daily
            </ChoiceButton>
            <ChoiceButton
              active={dateRange === 'weekly'}
              onClick={() => {
                setDateRange('weekly');
              }}
            >
              Weekly
            </ChoiceButton>
            <ChoiceButton
              active={dateRange === 'monthly'}
              onClick={() => {
                setDateRange('monthly');
              }}
            >
              Monthly
            </ChoiceButton>
          </Box>

          {/* bar chart */}
          <Box className="">
            {/* <Typography className="mb-[-10px] font-bold">
              {user.role === 'admin' ? 'All Sales' : `Sales for your store`}
            </Typography> */}
            <Box className="h-full">
              <VictoryChart theme={VictoryTheme.material} domainPadding={{ x: 40, y: 80 }} width={1000} height={500}>
                <VictoryAxis
                  tickFormat={
                    dateRange === 'weekly'
                      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                      : Object.keys(chartData)
                  }
                />
                <VictoryAxis dependentAxis tickFormat={(x) => `${x / 1000}k`} />
                <VictoryBar
                  labels={({ datum }) => `Sales: ${datum.earnings} MZN`}
                  labelComponent={<VictoryTooltip />}
                  alignment="middle"
                  data={chartFormattedData}
                  barWidth={40}
                  style={{
                    data: { fill: colors.primary.main },
                  }}
                  x="day"
                  y="earnings"
                />
                <VictoryLegend
                  x={400}
                  y={50}
                  title="All sales"
                  centerTitle
                  style={{ title: { fontSize: 30, fontWeight: 'bold' } }}
                  data={[]}
                />
              </VictoryChart>
            </Box>
          </Box>

          {/* progress bars */}
          <Typography className="text-center font-medium my-2 mt-8">Best Shops To sell its Products</Typography>
          <Box className="flex w-full">
            <Grid container className="w-full">
              {Object.entries(analytics.productsSoldByShops).map(([key, value]) => (
                <LinearProgressWithLabel key={key} value={value} title={key} />
              ))}
            </Grid>
          </Box>
        </Box>

        <Box className="flex flex-col w-full md:w-[30%]">
          <Box className="w-full h-max mt-8 md:mt-24">
            <Typography className="text-center font-semibold text-lg md:text-2xl text-[#455a64]">
              Best selling products
            </Typography>
            <VictoryPie
              animate={{ duration: 1000, easing: 'bounceInOut' }}
              colorScale={['lightblue', 'orangered', 'violet', 'cyan', 'navy', 'gold', 'blue', 'darkred']}
              data={pieData || [{ x: 'No sold products', y: 100 }]}
              theme={VictoryTheme.material}
              innerRadius={110}
              labelRadius={100}
              padAngle={1}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AnalyticsPage;
