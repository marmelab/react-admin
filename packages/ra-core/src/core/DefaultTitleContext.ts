import { createContext, useContext } from 'react';
import type { TitleComponent } from '../types';

// undefined when <Admin title> isn't set
export const DefaultTitleContext = createContext<TitleComponent | undefined>(
    undefined
);

export const DefaultTitleContextProvider = DefaultTitleContext.Provider;

/**
 * Get the application title defined at the `<Admin>` level
 *
 * @example
 * import { useDefaultTitle } from 'react-admin';
 *
 * const AppBar = () => {
 *    const defaultTitle = useDefaultTitle();
 *    return <span>{defaultTitle}</span>;
 * }
 */
export const useDefaultTitle = (): TitleComponent => {
    const title = useContext(DefaultTitleContext);
    return title === undefined ? 'React Admin' : title;
};
