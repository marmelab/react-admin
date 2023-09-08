---
layout: default
title: "Application Theme"
---

# Application Theme

If you want to override some styles across the entire application, you can use a custom theme, leveraging [the Material UI Theming support](https://mui.com/material-ui/customization/theming/). Custom themes let you override colors, fonts, spacing, and even the style of individual components.

![Music Player](./img/navidrome.png)

## Using A Custom Theme

Pass a custom `theme` to the `<Admin>` component to override the style of the entire application:

```jsx
import { Admin, defaultTheme } from 'react-admin';
import indigo from '@mui/material/colors/indigo';
import pink from '@mui/material/colors/pink';
import red from '@mui/material/colors/red';

const myTheme = {
    ...defaultTheme,
    palette: {
        primary: indigo,
        secondary: pink,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),
    },
};

const App = () => (
    <Admin theme={theme}>
        // ...
    </Admin>
);
```

Note that you don't need to call Material-UI's `createTheme` yourself. React-admin will do it for you.

## Theming Individual Components

In a custom theme, you can override the style of a component for the entire application using the `components` key.

For instance, to create a custom theme that overrides the style of the `<Datagrid>` component:

```jsx
import { defaultTheme } from 'react-admin';

const theme = {
    ...defaultTheme,
    components: {
        ...defaultTheme.components,
        RaDatagrid: {
            styleOverrides: {
              root: {
                  backgroundColor: "Lavender",
                  "& .RaDatagrid-headerCell": {
                      backgroundColor: "MistyRose",
                  },
              }
           }
        }
    }
};

const App = () => (
    <Admin theme={theme}>
        // ...
    </Admin>
);
```

There are 2 important gotchas here:

- Don't forget to merge your custom style overrides with the ones from react-admin's `defaultTheme`, otherwise the application will have the default Material UI theme (most notably, outlined text inputs)
- Custom style overrides must live under a `root` key. Then, the style override syntax is the same as the one used for the [`sx`](./SX.md) prop.

To guess the name of the subclass to use (like `.RaDatagrid-headerCell` above) for customizing a component, you can use the developer tools of your browser, or check the react-admin documentation for individual components (e.g. the [Datagrid CSS documentation](./Datagrid.md#sx-css-api)).

**Tip**: As an alternative, you can also re-export styled components, and use them instead of the react-admin components. Check the [Reusable Components](./SX.md#reusable-components) documentation for an example.

## Overriding Default Props

You can use this technique to override not only styles, but also defaults for components. That's how react-admin applies the `filled` variant to all `TextField` components. So for instance, to change the variant to `outlined`, create a custom theme as follows:

```jsx
import { defaultTheme } from 'react-admin';

const theme = {
    ...defaultTheme,
    components: {
        ...defaultTheme.components,
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'outlined',
            },
        },
    }
};
```

**Tip**: TypeScript will be picky when overriding the `variant` `defaultProp`. To avoid compilation errors, type the `variant` value as `const`:

```ts
import { defaultTheme } from 'react-admin';

const theme = {
    ...defaultTheme,
    components: {
        ...defaultTheme.components,
        MuiTextField: {
            defaultProps: {
                variant: 'outlined' as const,
            },
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'outlined' as const,
            },
        },
    }
};
```

## Using A Dark Theme

React-admin ships two base themes: light and dark. To use the dark theme, import the `darkTheme` and pass it as the `<Admin theme>` prop:

```jsx
import { darkTheme } from 'react-admin';

const App = () => (
    <Admin theme={darkTheme} dataProvider={...}>
        // ...
    </Admin>
);
```

![Dark theme](./img/dark-theme.png)

Alternatively, you can create a custom theme object with a `mode: 'dark'` palette:

```jsx
import { defaultTheme } from 'react-admin';

const darkTheme = {
    ...defaultTheme,
    palette: { mode: 'dark' }
};

const App = () => (
    <Admin theme={darkTheme} dataProvider={...}>
        // ...
    </Admin>
);
```

## Letting Users Choose The Theme

It's a common practice to support both a light theme and a dark theme in an application, and let users choose which one they prefer. 

<video controls autoplay playsinline muted loop>
  <source src="./img/ToggleThemeButton.webm" type="video/webm"/>
  <source src="./img/ToggleThemeButton.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


React-admin's `<Admin>` component accepts a `darkTheme` prop in addition to the `theme` prop. 

```jsx
import { Admin, defaultTheme } from 'react-admin';

const lightTheme = defaultTheme;
const darkTheme = { ...defaultTheme, palette: { mode: 'dark' } };

const App = () => (
    <Admin
        dataProvider={...}
        theme={lightTheme}
        darkTheme={darkTheme}
    >
        // ...
    </Admin>
);
```

With this setup, the default application theme depends on the user's system settings. If the user has chosen a dark mode in their OS, react-admin will use the dark theme. Otherwise, it will use the light theme.

In addition, users can switch from one theme to the other using [the `<ToggleThemeButton>` component](./ToggleThemeButton.md), which appears in the AppBar as soon as you define a `darkTheme` prop.

## Changing the Theme Programmatically

React-admin provides the `useTheme` hook to read and update the theme programmatically. It uses the same syntax as `useState`. Its used internally by [the `<ToggleThemeButton>` component](./ToggleThemeButton.md).

```jsx
import { defaultTheme, useTheme } from 'react-admin';
import { Button } from '@mui/material';

const ThemeToggler = () => {
    const [theme, setTheme] = useTheme();

    return (
        <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        </Button>
    );
}
```

## Customizing The Sidebar Width

You can specify the `Sidebar` width by setting the `width` and `closedWidth` properties on your custom Material UI theme:

```jsx
import { defaultTheme } from 'react-admin';

const theme = {
    ...defaultTheme,
    sidebar: {
        width: 300, // The default value is 240
        closedWidth: 70, // The default value is 55
    },
};

const App = () => (
    <Admin theme={theme} dataProvider={...}>
        // ...
    </Admin>
);
```

For more advanced sidebar theming, pass your own `Sidebar` component to a custom `Layout`:

{% raw %}
```jsx
import { Sidebar, Layout } from 'react-admin';

const MySidebar = (props) => (
    <Sidebar
        sx={{
            "& .RaSidebar-drawerPaper": {
                backgroundColor: "red",
            },
        }}
        {...props}
    />
);

const MyLayout = props => <Layout {...props} sidebar={MySidebar} />
```
{% endraw %}

## Writing a Custom Theme

Material UI theming also allows to change the default palette, typography, colors, etc. This is very useful to change the react-admin style to match the branding of your company.

A `theme` object can contain the following keys:

* `breakpoints`
* `direction`
* `mixins`
* `components`
* `palette`
* `props`
* `shadows`
* `spacing`
* `transitions`
* `typography`
* `zIndex`

**Tip**: Check [Material UI default theme documentation](https://mui.com/material-ui/customization/default-theme/) to see the default values and meaning for these keys.

```jsx
import { lime, purple } from '@mui/material/colors';

const theme = {
  palette: {
    primary: {
      main: '#FF5733',
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#E0C2FF',
      light: '#F5EBFF',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#47008F',
    },
  },
  spacing: 4,
  typography: {
    fontFamily: 'Raleway, Arial',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Raleway';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Raleway'), local('Raleway-Regular'), url(${RalewayWoff2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
};
```

Once your theme is defined, pass it to the `<Admin>` component, in the `theme` prop.

```jsx
const App = () => (
    <Admin theme={myTheme} dataProvider={...}>
        // ...
    </Admin>
);
```

You can write a custom theme from scratch, or start from the [default theme](#default-theme) and override some values:

```jsx
import { defaultTheme } from 'react-admin';

const theme = {
    ...defaultTheme,
    components: {
        ...defaultTheme.components,
        RaDatagrid: {
            styleOverrides: {
              root: {
                  backgroundColor: "Lavender",
                  "& .RaDatagrid-headerCell": {
                      backgroundColor: "MistyRose",
                  },
              }
           }
        }
    }
};
```

## Default Theme

React-admin provides a theme that customizes a few Material-UI settings. You can import and use this react-admin default theme as a starting point for your custom theme:

```jsx
import { defaultTheme } from 'react-admin';

const myTheme = {
    ...defaultTheme,
    palette: {
        ...defaultTheme.palette,
        secondary: {
            main: '#11cb5f',
        },
    },
};
```

Here is the default theme:

```tsx
import { RaThemeOptions } from './layout/Theme';

const defaultThemeInvariants = {
    typography: {
        h6: {
            fontWeight: 400,
        },
    },
    sidebar: {
        width: 240,
        closedWidth: 50,
    },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: 'filled' as const,
                margin: 'dense' as const,
                size: 'small' as const,
            },
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'filled' as const,
                margin: 'dense' as const,
                size: 'small' as const,
            },
        },
    },
};

export const defaultLightTheme: RaThemeOptions = {
    palette: {
        background: {
            default: '#fafafb',
        },
        secondary: {
            light: '#6ec6ff',
            main: '#2196f3',
            dark: '#0069c0',
            contrastText: '#fff',
        },
    },
    ...defaultThemeInvariants,
    components: {
        ...defaultThemeInvariants.components,
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    '&$disabled': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
    },
};

export const defaultDarkTheme: RaThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        background: {
            default: '#313131',
        },
    },
    ...defaultThemeInvariants,
};

export const defaultTheme = defaultLightTheme;
```
