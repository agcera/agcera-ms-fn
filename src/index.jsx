import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { Button } from '@mui/material';
import { Provider } from 'react-redux';
import store from './redux/store';
import Users from './components/Users';
import App from './app';
import { StyledEngineProvider } from '@mui/material/styles';


const cache = createCache({
  key: 'css',
  prepend: true,
});



const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
		<CacheProvider value={cache}>
			<StyledEngineProvider injectFirst>
							<App/>
			</StyledEngineProvider>

		</CacheProvider>,
  // </React.StrictMode>,
)
