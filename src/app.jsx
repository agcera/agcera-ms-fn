import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store';
import router from './routes';
import { ColorModeContext, useMode } from './themeConfig';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <ToastContainer />
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
