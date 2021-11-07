import React from 'react';
import { useResourceContext } from 'ra-core';
import { Show as RaShow, ShowProps, SimpleShowLayout } from 'ra-ui-materialui';
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

export const ShowForm = () => {
    const resource = useResourceContext();
    const [resources] = useResourcesConfiguration();
    const [resourceConfiguration] = useResourceConfiguration(resource);

    return (
        <SimpleShowLayout>
            {resourceConfiguration.fields
                .filter(definition => definition.views.includes('show'))
                .map(definition =>
                    getFieldFromFieldDefinition(definition, resources)
                )}
        </SimpleShowLayout>
    );
};
