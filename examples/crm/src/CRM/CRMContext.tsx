import { createContext, ReactNode, useContext } from 'react';
import { crmConfig } from './crm.config';

// Define types for the context value
interface CRMContextValue {
    companySectors?: string[];
    dealSteps?: string[];
    dealCategories?: string[];
    noteStatuses?: string[];
    noteTypes?: string[];
    title?: string;
    logo?: string;
}

// Define types for the CRMProvider props
interface CRMProviderProps extends CRMContextValue {
    children: ReactNode;
}

// Create context with default value
export const CRMContext = createContext<CRMContextValue>({
    companySectors: crmConfig.companySectors,
    dealSteps: [],
    dealCategories: [],
    noteStatuses: [],
    noteTypes: [],
    title: crmConfig.title,
    logo: crmConfig.logo,
});

export const CRMProvider = ({
    children,
    companySectors = crmConfig.companySectors,
    dealSteps,
    dealCategories,
    logo = crmConfig.logo,
    noteStatuses,
    noteTypes,
    title = crmConfig.title,
}: CRMProviderProps) => (
    <CRMContext.Provider
        value={{
            companySectors,
            dealSteps,
            dealCategories,
            logo,
            noteStatuses,
            noteTypes,
            title,
        }}
    >
        {children}
    </CRMContext.Provider>
);

export const useCRMContext = () => useContext(CRMContext);
