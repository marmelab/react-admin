import { useState } from 'react';
import { Theme, ThemeContext } from './themeContext';
import { basicDarkTheme, basicLightTheme } from './basicTheme';

export const ThemeContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [theme, setTheme] = useState<Theme>({
        name: 'basic',
        light: basicLightTheme,
        dark: basicDarkTheme,
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
