import { createContext } from 'react';
import { LoadingComponent } from '../types';

export const LoadingContext = createContext<LoadingComponent>(() => null);
