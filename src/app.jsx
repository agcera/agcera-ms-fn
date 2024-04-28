import { ColorModeContext, useMode } from './themeConfig';
import { Button, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import Topbar from './global/Topbar';
import Sidebar from './global/Sidebar';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="h-full w-full flex relative">
          {/* the topbar */}
             <Sidebar/>

          <main className="main-content w-full">

          <Topbar />

            {/* routes will be defined here */}
            <Typography variant="display" className="text-primary font-semibold">
              Hello World
            </Typography>
            <Button>Hello click me</Button>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
