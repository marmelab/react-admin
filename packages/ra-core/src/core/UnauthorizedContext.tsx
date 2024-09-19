import { ComponentType, createContext } from 'react';

export const UnauthorizedContext = createContext<ComponentType>(() => null);
