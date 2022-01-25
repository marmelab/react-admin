import React from 'react';
import {
    Show as RaShow,
    SimpleShowLayout,
    useResourceContext,
} from 'react-admin';
import {
    useResourceConfiguration,
    useResourcesConfiguration,
} from '../ResourceConfiguration';
import { getFieldFromFieldDefinition } from './getFieldFromFieldDefinition';

export const Show = () => (
    <RaShow>
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
