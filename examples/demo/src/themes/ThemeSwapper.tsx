import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useContext, useState } from 'react';
import { ToggleThemeButton, useStore, useTranslate } from 'react-admin';

import { ThemeContext, ThemeType, themes } from './themeContext';

export const ThemeSwapper = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [_, setThemeStore] = useStore<ThemeType>('theme');
    const { theme: themeFromContext, changeTheme } = useContext(ThemeContext);
    const handleChange = (_: React.MouseEvent<HTMLElement>, index: number) => {
        console.log(index);
        const newTheme = themes[index];
        setThemeStore(newTheme.name);
        changeTheme(newTheme);
        setAnchorEl(null);
    };

    const translate = useTranslate();
    const toggleThemeTitle = translate('pos.action.change_theme', {
        _: 'Change Theme',
    });

    return (
        <>
            <Tooltip title={toggleThemeTitle} enterDelay={300}>
                <IconButton
                    onClick={handleClick}
                    color="inherit"
                    aria-label={toggleThemeTitle}
                >
                    <ColorLensIcon />
                </IconButton>
            </Tooltip>
            <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
                {themes.map((theme, index) => (
                    <MenuItem
                        onClick={event => handleChange(event, index)}
                        value={theme.name}
                        key={theme.name}
                        selected={theme.name === themeFromContext.name}
                    >
                        {theme.name}
                    </MenuItem>
                ))}
            </Menu>

            {themeFromContext.dark ? <ToggleThemeButton /> : null}
        </>
    );
};
