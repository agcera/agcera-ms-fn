import { ColorModeContext, useMode } from './themeConfig';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from './global/Topbar';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          {/* the topbar */}
          <main className="main-content">
            <Topbar />

            {/* routes will be defined here */}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
