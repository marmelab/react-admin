import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTranslate } from 'ra-core';
import { useTheme } from '../layout';
import { RaThemeOptions } from '..';

/**
 * Button toggling the theme (light or dark).
 *
 * @example
 *
 *     const MyAppBar = props => (
 *         <AppBar {...props}>
 *             <Box flex="1">
 *                 <Typography variant="h6" id="react-admin-title"></Typography>
 *             </Box>
 *             <ToggleThemeButton />
 *         </AppBar>
 *     );
 *
 *     const MyLayout = props => <Layout {...props} appBar={MyAppBar} />;
 */
export const ToggleThemeButton = (props: ToggleThemeButtonProps) => {
    const translate = useTranslate();
    const { darkTheme, lightTheme } = props;
    const [theme, setTheme] = useTheme(lightTheme);

    const handleTogglePaletteType = (): void => {
        setTheme(theme?.palette.mode === 'dark' ? lightTheme : darkTheme);
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
                {theme?.palette.mode === 'dark' ? (
                    <Brightness7Icon />
                ) : (
                    <Brightness4Icon />
                )}
            </IconButton>
        </Tooltip>
    );
};

export interface ToggleThemeButtonProps {
    darkTheme?: RaThemeOptions;
    lightTheme?: RaThemeOptions;
}
