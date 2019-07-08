import React, { useEffect, useState } from 'react';
import inflection from 'inflection';
import {
    useEditController,
    InferredElement,
    getElementsFromRecords,
} from 'ra-core';

import { EditView } from './Edit';
import editFieldTypes from './editFieldTypes';

const EditViewGuesser = props => {
    const { record, resource } = props;
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
                    )}Edit = props => (
    <Edit {...props}>
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

const EditGuesser = props => (
    <EditViewGuesser {...props} {...useEditController(props)} />
);

export default EditGuesser;
