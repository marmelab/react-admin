import { useState } from 'react';
import { Theme, ThemeContext } from './themeContext';
import { softDarkTheme, softLightTheme } from './softTheme';

export const ThemeContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [theme, setTheme] = useState<Theme>({
        name: 'soft',
        light: softLightTheme,
        dark: softDarkTheme,
    });

    const changeTheme = (theme: Theme) => {
        setTheme(theme);
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
