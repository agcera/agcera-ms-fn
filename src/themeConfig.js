import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import defaultTheme from 'tailwindcss/defaultTheme';
import { defaultColors } from '../tailwind.config';

// color design tokens export
export const tokens = (mode) => {
  if (mode === 'dark') {
    return {};
  }
  return {
    primary: {
      main: '#005ea2',
      light: '#008cc9',
      dark: ' #183884',
    },
    secondary: {
      main: '#bf1723',
      light: '#ff0d20',
      dark: '#b41419',
    },
    background: {
      main: '#fcfbfb',
    },
    highlight: {
      main: '#cfcfcf',
    },
    success: {
      main: '#03d263',
    },
    error: {
      main: '#ff0d20',
    },
    text_light: {
      main: '#ffffff',
    },
    text_dark: {
      main: '#28272A',
    },
  };
};

createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            color: 'black',
            backgroundColor: '#ff0000',
            '&:hover': {
              backgroundColor: '#008cc9',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            color: 'white',
            backgroundColor: '#bf1723',
            '&:hover': {
              backgroundColor: '#ff0d20',
            },
          },
        },
      ],
    },
  },
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...defaultColors,
      ...colors,
    },
    typography: {
      fontFamily: ['Graphik', 'sans-serif', ...defaultTheme.fontFamily.sans].join(','),
      fontSize: 14,
      display: {
        fontSize: '2rem',
      },
      header: {
        fontSize: '1.5rem',
      },
      subHeader: {
        fontSize: '1.25rem',
      },
      body1: {
        fontSize: '1rem',
      },
      body2: {
        fontSize: '0.875rem',
      },
      info1: {
        fontSize: '0.75rem',
      },
      info2: {
        fontSize: '0.625rem',
      },
    },
    components: {},
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
