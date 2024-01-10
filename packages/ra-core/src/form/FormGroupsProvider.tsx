import * as React from 'react';
import { ReactNode, useMemo, useRef } from 'react';
import {
    FormGroupsContext,
    FormGroupsContextValue,
    FormGroupSubscriber,
} from './FormGroupsContext';

/**
 * This component provides functions through context to manage form groups,
 * allowing to link or unlink an input to a group.
 * @see FormGroupContextProvider
 * @see useFormGroup
 * @see useFormGroups
 */
export const FormGroupsProvider = ({ children }: { children: ReactNode }) => {
    const formGroups = useRef<{ [key: string]: string[] }>({});
    const subscribers = useRef<{
        [key: string]: FormGroupSubscriber[];
    }>({});

    const formContextValue = useMemo<FormGroupsContextValue>(
        () => ({
            /**
             * Register a subscriber function for the specified group. The subscriber
             * will be called whenever the group content changes (fields added or removed).
             */
            subscribe: (group, subscriber) => {
                if (!subscribers.current[group]) {
                    subscribers.current[group] = [];
                }
                subscribers.current[group].push(subscriber);

                return () => {
                    subscribers.current[group] = subscribers.current[
                        group
                    ].filter(s => s !== subscriber);
                };
            },
            getGroupFields: name => formGroups.current[name] || [],
            registerGroup: name => {
                formGroups.current[name] = formGroups.current[name] || [];
            },
            unregisterGroup: name => {
                delete formGroups[name];
            },
            registerField: (source, group) => {
                if (group != null) {
                    if (!(formGroups.current[group] || []).includes(source)) {
                        formGroups.current[group] = [
                            ...(formGroups.current[group] || []),
                            source,
                        ];
                        // Notify subscribers that the group fields have changed
                        if (subscribers.current[group]) {
                            subscribers.current[group].forEach(subscriber =>
                                subscriber()
                            );
                        }
                    }
                }
            },
            unregisterField: (source, group) => {
                if (group != null) {
                    if (!formGroups.current[group]) {
                        console.warn(`Invalid form group ${group}`);
                    } else {
                        const fields = new Set(formGroups.current[group]);
                        fields.delete(source);
                        formGroups.current[group] = Array.from(fields);

                        // Notify subscribers that the group fields have changed
                        if (subscribers.current[group]) {
                            subscribers.current[group].forEach(subscriber =>
                                subscriber()
                            );
                        }
                    }
                }
            },
        }),
        []
    );

    return (
        <FormGroupsContext.Provider value={formContextValue}>
            {children}
        </FormGroupsContext.Provider>
    );
};
