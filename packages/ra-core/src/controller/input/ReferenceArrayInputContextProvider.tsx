import * as React from 'react';
import { ReactNode } from 'react';
import {
    ReferenceArrayInputContext,
    ReferenceArrayInputContextValue,
} from './ReferenceArrayInputContext';

/**
 * Provider for the context which provides access to the useReferenceArrayInput features.
 *
 * @example
 * const ReferenceArrayInput = ({ children }) => {
 *     const controllerProps = useReferenceArrayInputController();
 *     return (
 *         <ReferenceArrayInputContextProvider value={controllerProps}>
 *             {children}
 *         </ReferenceArrayInputContextProvider>
 *     )
 * }
 */
export const ReferenceArrayInputContextProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: ReferenceArrayInputContextValue;
}) => (
    <ReferenceArrayInputContext.Provider value={value}>
        {children}
    </ReferenceArrayInputContext.Provider>
);
