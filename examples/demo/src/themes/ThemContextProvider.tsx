import { useState } from 'react';
import { lightTheme } from './lightTheme';
import { ThemeContext } from './themeContext';

export const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState({ name: 'light', theme: lightTheme });

    const changeTheme = theme => {
        setTheme(theme);
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
