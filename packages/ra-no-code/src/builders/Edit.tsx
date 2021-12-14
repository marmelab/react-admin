import React from 'react';
import {
    Edit as RaEdit,
    SimpleForm,
    SimpleFormProps,
    useResourceContext,
} from 'react-admin';
import {
    useResourceConfiguration,
    useResourcesConfiguration,
} from '../ResourceConfiguration';
import { getInputFromFieldDefinition } from './getInputFromFieldDefinition';

export const Edit = () => (
    <RaEdit>
        <EditForm />
    </RaEdit>
);

export const EditForm = (props: Omit<SimpleFormProps, 'children'>) => {
    const resource = useResourceContext(props);
    const [resources] = useResourcesConfiguration();
    const [resourceConfiguration] = useResourceConfiguration(resource);

    return (
        <SimpleForm {...props}>
            {resourceConfiguration.fields
                .filter(definition => definition.views.includes('edit'))
                .map(definition =>
                    getInputFromFieldDefinition(definition, resources)
                )}
        </SimpleForm>
    );
};
