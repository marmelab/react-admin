import React from 'react';
import {
    EditContextProvider,
    EditControllerProps,
    useEditContext,
    useEditController,
} from 'ra-core';
import { EditProps, EditView, SimpleForm } from 'ra-ui-materialui';
import { useResource } from '../ResourceConfiguration';
import { getInputFromFieldDefinition } from './getInputFromFieldDefinition';

export const EditBuilder = (props: EditProps) => {
    const controllerProps = useEditController(props);

    return (
        <EditContextProvider value={controllerProps}>
            <EditBuilderView {...props} {...controllerProps} />
        </EditContextProvider>
    );
};

export const EditBuilderView = (
    props: EditProps & Omit<EditControllerProps, 'resource'>
) => {
    const { resource } = useEditContext(props);
    const [resourceConfiguration] = useResource(resource);

    return (
        <EditView {...props}>
            <SimpleForm>
                {resourceConfiguration.fields.map(definition =>
                    getInputFromFieldDefinition(definition)
                )}
            </SimpleForm>
        </EditView>
    );
};
