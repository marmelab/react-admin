import React, { useMemo } from 'react';
import {
    EditContextProvider,
    EditControllerProps,
    useEditContext,
    useEditController,
} from 'ra-core';
import { EditProps, EditView, SimpleForm } from 'ra-ui-materialui';
import { useGetFieldDefinitions } from './useGetFieldDefinitions';
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
    const { resource, record } = useEditContext(props);
    const records = useMemo(() => (record ? [record] : []), [record]);
    const definitions = useGetFieldDefinitions(resource as string, records);

    return (
        <EditView {...props}>
            <SimpleForm>
                {definitions.map(definition =>
                    getInputFromFieldDefinition(definition)
                )}
            </SimpleForm>
        </EditView>
    );
};
