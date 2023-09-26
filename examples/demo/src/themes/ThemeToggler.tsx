import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { useContext } from 'react';
import { useStore, useTranslate } from 'react-admin';
import { ThemeContext, ThemeType, themes } from './themeContext';

export const ThemeToggler = () => {
    const [_, setThemeStore] = useStore<ThemeType>('theme');
    const translate = useTranslate();

    const { theme, changeTheme } = useContext(ThemeContext);

    const handleChange = (event: SelectChangeEvent) => {
        setThemeStore(event.target.value as ThemeType);
        changeTheme(
            themes.find(
                theme => theme.name === (event.target.value as ThemeType)
            )
        );
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="theme-select-label">
                    {translate('pos.theme.name')}
                </InputLabel>
                <Select
                    labelId="theme-select-label"
                    id="theme-select"
                    value={theme.name}
                    label="Theme"
                    onChange={handleChange}
                >
                    {themes.map(theme => (
                        <MenuItem value={theme.name} key={theme.name}>
                            {theme.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};
