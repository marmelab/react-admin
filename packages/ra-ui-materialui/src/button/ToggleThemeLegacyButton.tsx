import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTranslate } from 'ra-core';

import { useTheme, RaThemeOptions } from '../theme';

/**
 * Button toggling the theme (light or dark).
 *
 * @deprecated Set the lightTheme and darkTheme props in the <Admin> component.
 *
 * @example
 * import { AppBar, TitlePortal, ToggleThemeLegacyButton } from 'react-admin';
 *
 * const MyAppBar = () => (
 *     <AppBar>
 *         <TitlePortal />
 *         <ToggleThemeButton lightTheme={lightTheme} darkTheme={darkTheme} />
 *     </AppBar>
 * );
 *
 * const MyLayout = props => <Layout {...props} appBar={MyAppBar} />;
 */
export const ToggleThemeLegacyButton = (
    props: ToggleThemeLegacyButtonProps
) => {
    const translate = useTranslate();
    const { darkTheme, lightTheme } = props;
    const [theme, setTheme] = useTheme();
    // @ts-ignore
    const isDark = theme === 'dark' || theme?.palette.mode === 'dark';

    const handleTogglePaletteType = (): void => {
        setTheme(isDark ? lightTheme : darkTheme);
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
                {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Tooltip>
    );
};

export interface ToggleThemeLegacyButtonProps {
    darkTheme: RaThemeOptions;
    lightTheme?: RaThemeOptions;
}
