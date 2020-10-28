import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import { ResourceContext, ResourceContextValue } from './ResourceContext';

export const ResourceProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: ResourceContextValue;
}): ReactElement => (
    <ResourceContext.Provider value={value}>
        {children}
    </ResourceContext.Provider>
);
