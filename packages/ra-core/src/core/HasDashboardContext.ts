import { createContext, useContext } from 'react';

export const HasDashboardContext = createContext<boolean>(undefined);

export const HasDashboardContextProvider = HasDashboardContext.Provider;

export const useHasDashboard = () => useContext(HasDashboardContext);
