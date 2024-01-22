import { createContext, useContext } from 'react';
import type { TitleComponent } from '../types';

export const DefaultTitleContext = createContext<TitleComponent>('React Admin');

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
export const useDefaultTitle = () => useContext(DefaultTitleContext);
