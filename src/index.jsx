import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StyledEngineProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';

const cache = createCache({
  key: 'css',
  prepend: true,
});

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
  <CacheProvider value={cache}>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </CacheProvider>
  // </React.StrictMode>,
);
