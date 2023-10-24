import * as React from 'react';
import { useResourceDefinitions } from 'ra-core';

import { ResourceMenuItem } from './ResourceMenuItem';

export const ResourceMenuItems = () => {
    const resources = useResourceDefinitions();
    return (
        <>
            {Object.keys(resources)
                .filter(name => resources[name].hasList)
                .map(name => (
                    <ResourceMenuItem key={name} name={name} />
                ))}
        </>
    );
};
