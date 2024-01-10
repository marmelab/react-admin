import { createContext, useContext } from 'react';
import { Application } from './ApplicationsDashboard';

export type ApplicationContextValue = {
    application: Application;
    onExit: () => void;
};

export const ApplicationContext = createContext<ApplicationContextValue>(
    undefined
);

export const useApplication = () => useContext(ApplicationContext);
