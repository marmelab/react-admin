import { createContext } from 'react';

export const FormGroupsContext = createContext<
    FormGroupsContextValue | undefined
>(undefined);

export type FormGroupSubscriber = () => void;

export type FormGroupsContextValue = {
    registerGroup: (name: string) => void;
    unregisterGroup: (name: string) => void;
    registerField: (source: string, group?: string) => void;
    unregisterField: (source: string, group?: string) => void;
    getGroupFields: (name: string) => string[];
    /**
     * Subscribe to any changes of the group content (fields added or removed).
     * Subscribers can get the current fields of the group by calling getGroupFields.
     * Returns a function to unsubscribe.
     */
    subscribe: (name: string, subscriber: FormGroupSubscriber) => () => void;
};
