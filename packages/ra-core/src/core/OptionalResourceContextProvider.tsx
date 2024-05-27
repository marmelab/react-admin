import * as React from 'react';
import { ReactElement } from 'react';
import { ResourceContextValue } from './ResourceContext';
import { ResourceContextProvider } from './ResourceContextProvider';

/**
 * Wrap children with a ResourceContext provider only if the value is defined.
 *
 * Allows a component to work outside of a resource context.
 *
 * @example
 *
 * import { OptionalResourceContextProvider, EditButton } from 'react-admin';
 *
 * const Button = ({ resource }) => (
 *     <OptionalResourceContextProvider value={resource}>
 *         <EditButton />
 *     </OptionalResourceContextProvider>
 * );
 */
export const OptionalResourceContextProvider = ({
    value,
    children,
}: {
    value?: ResourceContextValue;
    children: ReactElement;
}) =>
    value ? (
        <ResourceContextProvider value={value}>
            {children}
        </ResourceContextProvider>
    ) : (
        children
    );
