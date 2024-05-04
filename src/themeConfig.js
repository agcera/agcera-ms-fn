import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import defaultTheme from 'tailwindcss/defaultTheme';
import { defaultColors } from '../tailwind.config';
import { outlinedInputClasses } from '@mui/material';

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
    blue: {
      main: '#E6EEF5',
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
    specialBlue: {
      main: '#E6EEF5',
    },
  };
};

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    shape: {
      borderRadius: 5,
    },
    palette: {
      mode: mode,
      ...defaultColors,
      ...colors,
      common: {
        white: '#ffffff',
        black: '#28272A',
      },
      background: {
        paper: colors.background.main,
      },
      action: {
        disabled: defaultColors.gray[100],
      },
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
      allVariants: {
        lineHeight: 1.25,
      },
    },
    components: {
      MuiTypography: {
        defaultProps: {
          component: 'p',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            [`&:hover:not(.${outlinedInputClasses.disabled},.${outlinedInputClasses.error}) .${outlinedInputClasses.notchedOutline}`]:
              {
                borderColor: colors.primary.light,
              },
            [`&.${outlinedInputClasses.focused}:not(.${outlinedInputClasses.error}) .${outlinedInputClasses.notchedOutline}`]:
              {
                borderColor: colors.primary.light,
              },
          },
          notchedOutline: {
            borderColor: defaultColors.gray[600],
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            padding: 10,
            fontWeight: '500',
            fontSize: '1rem',
            textTransform: 'none',
            [`&:hover:not(&:active)`]: {
              boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.14)',
            },
          },
        },
        variants: [
          {
            props: { variant: 'contained', color: 'specialBlue' },
            style: {},
          },
          {
            props: { variant: 'contained', color: 'secondary' },
            style: {},
          },
        ],
      },
      MuiTouchRipple: {
        styleOverrides: {
          root: {
            color: colors.secondary.light,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: 4,
            borderRadius: 15,
          },
          barColorPrimary: {
            backgroundColor: colors.secondary.light,
            opacity: 0.75,
            borderRadius: 15,
          },
        },
      },
      MuiContainer: {
        defaultProps: {
          disableGutters: true,
        },
      },
    },
  };
};

createTheme({
  components: {},
});

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
