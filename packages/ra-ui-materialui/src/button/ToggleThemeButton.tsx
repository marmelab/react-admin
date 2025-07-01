import React from 'react';
import { Tooltip, IconButton, useMediaQuery } from '@mui/material';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTranslate } from 'ra-core';

import { useThemesContext, useTheme } from '../theme';

/**
 * Button toggling the theme (light or dark).
 *
 * Enabled by default in the <AppBar> when the <Admin> component has a darkMode.
 *
 * @example
 * import { AppBar, ToggleThemeButton } from 'react-admin';
 *
 * const MyAppBar = () => (
 *     <AppBar toolbar={<ToggleThemeButton />} />
 * );
 *
 * const MyLayout = ({ children }) => (
 *     <Layout appBar={MyAppBar}>
 *         {children}
 *     </Layout>
 * );
 */
export const ToggleThemeButton = () => {
    const props = useThemeProps({
        props: {},
        name: PREFIX,
    });

    const translate = useTranslate();
    const { darkTheme, defaultTheme } = useThemesContext();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    const [theme, setTheme] = useTheme(
        defaultTheme || (prefersDarkMode && darkTheme ? 'dark' : 'light')
    );

    const handleTogglePaletteType = (): void => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    const toggleThemeTitle = translate('ra.action.toggle_theme', {
        _: 'Toggle Theme',
    });

    return (
        <Tooltip title={toggleThemeTitle} enterDelay={300}>
            <StyledIconButton
                color="inherit"
                onClick={handleTogglePaletteType}
                aria-label={toggleThemeTitle}
                {...props}
            >
                {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </StyledIconButton>
        </Tooltip>
    );
};

const PREFIX = 'RaToggleThemeButton';

const StyledIconButton = styled(IconButton, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface Components {
        [PREFIX]?: {
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
