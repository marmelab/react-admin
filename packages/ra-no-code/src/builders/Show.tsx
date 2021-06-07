import React from 'react';
import { useResourceContext } from 'ra-core';
import {
    Show as RaShow,
    ShowProps,
    SimpleShowLayout,
    SimpleShowLayoutProps,
} from 'ra-ui-materialui';
import {
    useResourceConfiguration,
    useResourcesConfiguration,
} from '../ResourceConfiguration';
import { getFieldFromFieldDefinition } from './getFieldFromFieldDefinition';

export const Show = (props: ShowProps) => (
    <RaShow {...props}>
        <ShowForm />
    </RaShow>
);

export const ShowForm = (props: Omit<SimpleShowLayoutProps, 'children'>) => {
    const resource = useResourceContext(props);
    const [resources] = useResourcesConfiguration();
    const [resourceConfiguration] = useResourceConfiguration(resource);

    return (
        <SimpleShowLayout {...props}>
            {resourceConfiguration.fields
                .filter(definition => definition.views.includes('show'))
                .map(definition =>
                    getFieldFromFieldDefinition(definition, resources)
                )}
        </SimpleShowLayout>
    );
};
