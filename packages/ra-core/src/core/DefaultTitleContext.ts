import { createContext, useContext } from 'react';
import type { TitleComponent } from '../types';

export const DefaultTitleContext = createContext<TitleComponent>('React Admin');

export const DefaultTitleContextProvider = DefaultTitleContext.Provider;

export const useDefaultTitle = () => useContext(DefaultTitleContext);
