import * as React from 'react';
import { useEffect, useState } from 'react';
import inflection from 'inflection';
import {
    useEditController,
    EditContextProvider,
    InferredElement,
    useResourceContext,
    useEditContext,
    getElementsFromRecords,
} from 'ra-core';

import { EditProps } from '../types';
import { EditView } from './EditView';
import { editFieldTypes } from './editFieldTypes';

const EditViewGuesser = props => {
    const resource = useResourceContext(props);
    const { record } = useEditContext();
    const [inferredChild, setInferredChild] = useState(null);
    useEffect(() => {
        if (record && !inferredChild) {
            const inferredElements = getElementsFromRecords(
                [record],
                editFieldTypes
            );
            const inferredChild = new InferredElement(
                editFieldTypes.form,
                null,
                inferredElements
            );

            process.env.NODE_ENV !== 'production' &&
                // eslint-disable-next-line no-console
                console.log(
                    `Guessed Edit:

export const ${inflection.capitalize(
                        inflection.singularize(resource)
                    )}Edit = () => (
    <Edit>
${inferredChild.getRepresentation()}
    </Edit>
);`
                );
            setInferredChild(inferredChild.getElement());
        }
    }, [record, inferredChild, resource]);

    return <EditView {...props}>{inferredChild}</EditView>;
};

EditViewGuesser.propTypes = EditView.propTypes;

export const EditGuesser = (props: EditProps) => {
    const controllerProps = useEditController(props);
    return (
        <EditContextProvider value={controllerProps}>
            <EditViewGuesser {...props} />
        </EditContextProvider>
    );
};
