import React, { useMemo } from 'react';
import {
    CreateContextProvider,
    CreateControllerProps,
    useCreateContext,
    useCreateController,
} from 'ra-core';
import { CreateProps, CreateView, SimpleForm } from 'ra-ui-materialui';
import {
    getInputFromFieldDefinition,
    useGetFieldDefinitions,
} from './useGetFieldDefinitions';

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
    const { resource, record } = useCreateContext(props);
    const records = useMemo(() => (record ? [record] : []), [record]);
    const definitions = useGetFieldDefinitions(resource as string, records);

    return (
        <CreateView {...props}>
            <SimpleForm>
                {definitions.map(definition =>
                    getInputFromFieldDefinition(definition)
                )}
            </SimpleForm>
        </CreateView>
    );
};
