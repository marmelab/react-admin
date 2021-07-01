import React from 'react';
import { useResourceContext } from 'ra-core';
import {
    Create as RaCreate,
    CreateProps,
    SimpleForm,
    SimpleFormProps,
} from 'ra-ui-materialui';
import { getInputFromFieldDefinition } from './getInputFromFieldDefinition';
import {
    useResourceConfiguration,
    useResourcesConfiguration,
} from '../ResourceConfiguration';

export const Create = (props: CreateProps) => (
    <RaCreate {...props}>
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
