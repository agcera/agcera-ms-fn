import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import theme from './themeConfig';
import { Button } from '@mui/material';
import { Provider } from 'react-redux';
import store from './redux/store';
import Users from './components/Users';

const cache = createCache({
  key: 'css',
  prepend: true,
});

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
		<CacheProvider value={cache}>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<Provider store={store}>
						<div className='bg-red-800 w-full h-full overflow-auto'>
							<h1>Hello, TailwindCSS! 🤑</h1>
							<Button variant='text' color='success'>Hello, Material-UI! 🤑</Button>
							<Users />
						</div>
					</Provider>
				</ThemeProvider>
			</StyledEngineProvider>
		</CacheProvider>,
  // </React.StrictMode>,
)
