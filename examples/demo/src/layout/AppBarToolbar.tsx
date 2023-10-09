import { useContext } from 'react';
import {
    LoadingIndicator,
    LocalesMenuButton,
    ToggleThemeButton,
} from 'react-admin';

import { ThemeSwapper } from '../themes/ThemeSwapper';
import { ThemeContext } from '../themes/themeContext';

export const AppBarToolbar = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <>
            <LocalesMenuButton />
            <ThemeSwapper />
            {theme.dark ? <ToggleThemeButton /> : null}
            <LoadingIndicator />
        </>
    );
};
