import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { useStore, useTranslate } from 'react-admin';

type ThemeType = 'light' | 'dark' | 'synthwave';
const themes: ThemeType[] = ['light', 'dark', 'synthwave'];

export const ThemeToggler = () => {
    const [themeStore, setThemeStore] = useStore<ThemeType>('theme');
    const translate = useTranslate();

    const handleChange = (event: SelectChangeEvent) => {
        setThemeStore(event.target.value as ThemeType);
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
                    value={themeStore}
                    label="Theme"
                    onChange={handleChange}
                >
                    {themes.map(themeName => (
                        <MenuItem value={themeName}>{themeName}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};
