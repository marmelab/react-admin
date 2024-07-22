import { createContext, ReactNode, useContext } from 'react';
import { crmConfig } from './crm.config';

// Define types for the context value
export interface CRMContextValue {
    companySectors?: string[];
    dealCategories?: string[];
    dealStages?: { value: string; label: string }[];
    noteStatuses?: { value: string; label: string; color: string }[];
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
    dealCategories: crmConfig.dealCategories,
    dealStages: crmConfig.dealStages,
    noteStatuses: crmConfig.noteStatuses,
    title: crmConfig.title,
    logo: crmConfig.logo,
});

export const CRMProvider = ({
    children,
    companySectors = crmConfig.companySectors,
    dealCategories,
    dealStages = crmConfig.dealStages,
    logo = crmConfig.logo,
    noteStatuses = crmConfig.noteStatuses,
    title = crmConfig.title,
}: CRMProviderProps) => (
    <CRMContext.Provider
        value={{
            companySectors,
            dealCategories,
            dealStages,
            logo,
            noteStatuses,
            title,
        }}
    >
        {children}
    </CRMContext.Provider>
);

export const useCRMContext = () => useContext(CRMContext);
