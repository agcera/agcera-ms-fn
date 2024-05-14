import { Box, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import { MdAnalytics } from 'react-icons/md';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryPie, VictoryLabel } from 'victory';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalytics, selectAllanalytics } from '../redux/analyticsSlice';
import { useEffect } from 'react';
import { selectLoggedInUser } from '../redux/usersSlice';
import LinearProgress from '@mui/material/LinearProgress';
// import { ObjectFormatter } from '../utils/formatters';

function AnalyticsPage() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);
  const analytics = useSelector(selectAllanalytics);
  // const [initLoading, setInitLoading] = useState(true);

  console.log(user, 'userllllllllllllllll', user.role);
  console.log(analytics);

  useEffect(() => {
    const now = new Date();
    now.setDate(now.getDate() - 7);

    dispatch(
      getAnalytics({ from: now.toLocaleDateString(), to: new Date().toLocaleDateString(), storeId: user.storeId })
    ).then(({ error }) => {
      if (error) console.log(error);
    });
  }, [dispatch, user]);

  const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ];
  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }

  const SmallBox = ({ bg, color, number, text, icon }) => {
    return (
      <Box className={`smallb1 ${bg}  w-36 mr-2 h-20 flex-col justify-between p-3`}>
        {icon && <icon className="mb-2" />} {/* Conditionally render icon if it's provided */}
        <MdAnalytics className="mb-2" />
        <Typography variant={`body2 ${color} font-bold text-[14px]`}>{number}</Typography>
        <Typography variant={`body1 text-[14px] ${color} mt-2 font-bold`}>{text}</Typography>
      </Box>
    );
  };

  return (
    <Box>
      <PageHeader title="Analytics" hasHeader={true} />
      {/* constiner for all the information in the analytics  */}

      <Box className="all flex ml-5 justify-left md:flex-wrap">
        <Box className="col1 flex-[0.8] mr-[5%]">
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
          <Box className="bar h-[50vh] w-full mt-5">
            <Typography className="mb-[-10px] font-bold">
              {user.role === 'admin' ? 'All Sales' : `Sales for your store`}
            </Typography>
            <Box className="h-full">
              <VictoryChart
                // adding the material theme provided with Victory
                theme={VictoryTheme.material}
                domainPadding={10}
                className="w-full h-full"
              >
                <VictoryAxis
                  tickValues={[1, 2, 3, 4]}
                  tickFormat={['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']}
                />
                <VictoryAxis dependentAxis tickFormat={(x) => `$${x / 1000}k`} />
                <VictoryBar data={data} x="quarter" y="earnings" />
              </VictoryChart>
            </Box>
          </Box>

          {/* progress bars */}
          <Box className="pgbar">
            <Box sx={{ width: '100%' }}>
              <LinearProgressWithLabel value={20} />
            </Box>
          </Box>
        </Box>

        {/* right side  */}
        <Box className="col2">
          {/* big generate report  */}
          <Box className="report w-80 h-20 m-auto text-center  bg-secondary rounded-sm relative">
            <Typography variant="body1 font-bold text-[14px] text-white text-center m-auto absolute top-[40%] left-[30%]">
              Generate Report
            </Typography>
          </Box>

          {/* pie chart  */}
          <Box className="pie">
            <svg viewBox="0 0 400 400">
              <VictoryPie
                standalone={false}
                width={400}
                height={400}
                data={[
                  { x: 1, y: 120 },
                  { x: 2, y: 150 },
                  { x: 3, y: 75 },
                ]}
                innerRadius={100}
                labelRadius={120}
                style={{ labels: { fontSize: 20, fill: 'white' } }}
              />
              <VictoryLabel textAnchor="middle" style={{ fontSize: 20 }} x={200} y={200} text="products" />
            </svg>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AnalyticsPage;
