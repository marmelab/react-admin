import React from 'react';
import {
    CreateContextProvider,
    CreateControllerProps,
    useCreateContext,
    useCreateController,
} from 'ra-core';
import { CreateProps, CreateView, SimpleForm } from 'ra-ui-materialui';
import { getInputFromFieldDefinition } from './getInputFromFieldDefinition';
import { useResource } from '../ResourceConfiguration';

export const CreateBuilder = (props: CreateProps) => {
    const controllerProps = useCreateController(props);

    return (
        <CreateContextProvider value={controllerProps}>
            <CreateBuilderView {...props} {...controllerProps} />
        </CreateContextProvider>
    );
};

export const CreateBuilderView = (
    props: CreateProps & Omit<CreateControllerProps, 'resource'>
) => {
    const { resource } = useCreateContext(props);
    const [resourceConfiguration] = useResource(resource);

    return (
        <CreateView {...props}>
            <SimpleForm>
                {resourceConfiguration.fields.map(definition =>
                    getInputFromFieldDefinition(definition)
                )}
            </SimpleForm>
        </CreateView>
    );
};
