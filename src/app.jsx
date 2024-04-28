import { ColorModeContext, useMode } from './themeConfig';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from './components/global/Topbar';
import Sidebar from './components/global/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="h-full w-full flex relative">
          {/* the topbar */}
          <Sidebar />

          <main className="main-content w-full">
            <Topbar />

            {/* routes will be defined here */}
            {/* <Typography variant="display" className="text-primary font-semibold">
              Hello World
            </Typography>
            <Button>Hello click me</Button> */}

            <Router>
              <Routes>
                <Route path="/" element={DashboardPage} />
              </Routes>
            </Router>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
