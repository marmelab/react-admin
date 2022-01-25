import React from 'react';
import {
    Create as RaCreate,
    SimpleForm,
    SimpleFormProps,
    useResourceContext,
} from 'react-admin';
import { getInputFromFieldDefinition } from './getInputFromFieldDefinition';
import {
    useResourceConfiguration,
    useResourcesConfiguration,
} from '../ResourceConfiguration';

export const Create = () => (
    <RaCreate>
        <CreateForm />
    </RaCreate>
);

export const CreateForm = (props: Omit<SimpleFormProps, 'children'>) => {
    const resource = useResourceContext(props);
    const [resources] = useResourcesConfiguration();
    const [resourceConfiguration] = useResourceConfiguration(resource);

    return (
        <SimpleForm {...props}>
            {resourceConfiguration.fields
                .filter(definition => definition.views.includes('create'))
                .map(definition =>
                    getInputFromFieldDefinition(definition, resources)
                )}
        </SimpleForm>
    );
};
