import * as React from 'react';
import { useEffect, useState } from 'react';
import inflection from 'inflection';
import {
    ShowBase,
    InferredElement,
    getElementsFromRecords,
    useResourceContext,
    useShowContext,
} from 'ra-core';

import { ShowProps } from '../types';
import { ShowView } from './ShowView';
import { showFieldTypes } from './showFieldTypes';

const ShowViewGuesser = props => {
    const resource = useResourceContext(props);
    const { record } = useShowContext();
    const [inferredChild, setInferredChild] = useState(null);
    useEffect(() => {
        if (record && !inferredChild) {
            const inferredElements = getElementsFromRecords(
                [record],
                showFieldTypes
            );
            const inferredChild = new InferredElement(
                showFieldTypes.show,
                null,
                inferredElements
            );

            process.env.NODE_ENV !== 'production' &&
                // eslint-disable-next-line no-console
                console.log(
                    `Guessed Show:

export const ${inflection.capitalize(
                        inflection.singularize(resource)
                    )}Show = () => (
    <Show>
${inferredChild.getRepresentation()}
    </Show>
);`
                );
            setInferredChild(inferredChild.getElement());
        }
    }, [record, inferredChild, resource]);

    return <ShowView {...props}>{inferredChild}</ShowView>;
};

ShowViewGuesser.propTypes = ShowView.propTypes;

export const ShowGuesser = ({ id, onError, ...rest }: ShowProps) => (
    <ShowBase id={id} onError={onError}>
        <ShowViewGuesser {...rest} />
    </ShowBase>
);

export default ShowGuesser;
