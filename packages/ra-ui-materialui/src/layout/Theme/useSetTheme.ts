import { useContext } from 'react';
import { ThemeOptions } from '@mui/material';
import { ThemeContext, ThemeSetter } from './ThemeContext';

/**
 * A hook that returns a function to set the Material UI theme.
 *
 * @example
 * import { useSetTheme } from 'ra-ui-materialui';
 * import darkTheme from './darkTheme';
 *
 * const DarkThemeButton = () => {
 *     const setTheme = useSetTheme();
 *     return (
 *         <button onClick={() => setTheme(darkTheme)}>
 *             Dark Theme
 *         </button>
 *     );
 * }
 */
export const useSetTheme = (themeOverride?: ThemeOptions): ThemeSetter => {
    const context = useContext(ThemeContext);
    return context;
};
