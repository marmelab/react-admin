import { useState } from 'react';
import { lightTheme } from './lightTheme';
import { Theme, ThemeContext } from './themeContext';

export const ThemeContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [theme, setTheme] = useState<Theme>({
        name: 'light',
        theme: lightTheme,
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
