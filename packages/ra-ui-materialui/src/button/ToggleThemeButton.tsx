import React from 'react';
import { Tooltip, IconButton, useMediaQuery } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTranslate } from 'ra-core';

import { ToggleThemeLegacyButton } from './ToggleThemeLegacyButton';
import { useTheme } from '../layout';
import { RaThemeOptions } from '..';

/**
 * Button toggling the theme (light or dark).
 *
 * Uses the light and dark theme defined in the <Admin> component.
 *
 * @example
 * import { AppBar, TitlePortal, ToggleThemeButton } from 'react-admin';
 *
 * const MyAppBar = () => (
 *     <AppBar>
 *         <TitlePortal />
 *         <ToggleThemeButton />
 *     </AppBar>
 * );
 *
 * const MyLayout = props => <Layout {...props} appBar={MyAppBar} />;
 */
export const ToggleThemeButton = (props: ToggleThemeButtonProps) => {
    const translate = useTranslate();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    const [theme, setTheme] = useTheme(prefersDarkMode ? 'dark' : 'light');

    // FIXME: remove in v5
    if (props.darkTheme) {
        return (
            <ToggleThemeLegacyButton
                darkTheme={props.darkTheme}
                lightTheme={props.lightTheme}
            />
        );
    }

    const handleTogglePaletteType = (): void => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    const toggleThemeTitle = translate('ra.action.toggle_theme', {
        _: 'Toggle Theme',
    });

    return (
        <Tooltip title={toggleThemeTitle} enterDelay={300}>
            <IconButton
                color="inherit"
                onClick={handleTogglePaletteType}
                aria-label={toggleThemeTitle}
            >
                {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Tooltip>
    );
};

export interface ToggleThemeButtonProps {
    /**
     * @deprecated Set the lightTheme in the <Admin> component instead.
     */
    lightTheme?: RaThemeOptions;
    /**
     * @deprecated Set the darkTheme in the <Admin> component instead.
     */
    darkTheme?: RaThemeOptions;
}
