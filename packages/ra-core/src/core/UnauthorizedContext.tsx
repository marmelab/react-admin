import { createContext } from 'react';
import { UnauthorizedComponent } from '../types';

export const UnauthorizedContext = createContext<UnauthorizedComponent>(
    () => null
);
