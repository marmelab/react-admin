import { createContext, useContext } from 'react';
import { Application } from './ApplicationsDashboard';

export type ApplicationContextValue = {
    application?: Application;
    onExit: () => void;
};

export const ApplicationContext = createContext<
    ApplicationContextValue | undefined
>(undefined);

export const useApplication = () => {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error(
            'useApplication must be used inside an ApplicationContext.Provider'
        );
    }
    return context;
};
