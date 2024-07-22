import { createContext, ReactNode, useContext } from 'react';
import {
    defaultCompanySectors,
    defaultContactGender,
    defaultDealCategories,
    defaultDealPipelineStatuses,
    defaultDealStages,
    defaultLogo,
    defaultNoteStatuses,
    defaultTaskTypes,
    defaultTitle,
} from './defaultConfiguration';
import { ContactGender, DealStage, NoteStatus } from '../types';

// Define types for the context value
export interface ConfigurationContextValue {
    companySectors: string[];
    dealCategories: string[];
    dealPipelineStatuses: string[];
    dealStages: DealStage[];
    noteStatuses: NoteStatus[];
    taskTypes: string[];
    title: string;
    logo: string;
    contactGender: ContactGender[];
}

export interface ConfigurationProviderProps extends ConfigurationContextValue {
    children: ReactNode;
}

// Create context with default value
export const ConfigurationContext = createContext<ConfigurationContextValue>({
    companySectors: defaultCompanySectors,
    dealCategories: defaultDealCategories,
    dealPipelineStatuses: defaultDealPipelineStatuses,
    dealStages: defaultDealStages,
    noteStatuses: defaultNoteStatuses,
    taskTypes: defaultTaskTypes,
    title: defaultTitle,
    logo: defaultLogo,
    contactGender: defaultContactGender,
});

export const ConfigurationProvider = ({
    children,
    companySectors,
    dealCategories,
    dealPipelineStatuses,
    dealStages,
    logo,
    noteStatuses,
    taskTypes,
    title,
    contactGender,
}: ConfigurationProviderProps) => (
    <ConfigurationContext.Provider
        value={{
            companySectors,
            dealCategories,
            dealPipelineStatuses,
            dealStages,
            logo,
            noteStatuses,
            title,
            taskTypes,
            contactGender,
        }}
    >
        {children}
    </ConfigurationContext.Provider>
);

export const useConfigurationContext = () => useContext(ConfigurationContext);
