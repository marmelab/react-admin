---
layout: default
title: "useTheme"
---

# `useTheme`

React-admin provides the `useTheme` hook to read and update the [theme preference](./AppTheme.md#letting-users-choose-the-theme) (light or dark) programmatically. It uses the same syntax as React's `useState`. Its used internally by [the `<ToggleThemeButton>` component](./ToggleThemeButton.md).

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

**Tip**: Don't confuse react-admin's `useTheme` with Material-UI's `useTheme`. The latter is used to read the material-ui theme, while the former is used to read and update the user theme preference.