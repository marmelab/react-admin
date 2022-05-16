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

export const ShowGuesser = ({
    id,
    queryOptions,
    resource,
    ...rest
}: Omit<ShowProps, 'children'>) => (
    <ShowBase id={id} resource={resource} queryOptions={queryOptions}>
        <ShowViewGuesser {...rest} />
    </ShowBase>
);

const ShowViewGuesser = props => {
    const resource = useResourceContext(props);
    const { record } = useShowContext();
    const [child, setChild] = useState(null);

    useEffect(() => {
        setChild(null);
    }, [resource]);

    useEffect(() => {
        if (record && !child) {
            const inferredElements = getElementsFromRecords(
                [record],
                showFieldTypes
            );
            const inferredChild = new InferredElement(
                showFieldTypes.show,
                null,
                inferredElements
            );
            setChild(inferredChild.getElement());

            if (process.env.NODE_ENV === 'production') return;

            const representation = inferredChild.getRepresentation();
            const components = ['Show']
                .concat(
                    Array.from(
                        new Set(
                            Array.from(representation.matchAll(/<([^/\s>]+)/g))
                                .map(match => match[1])
                                .filter(component => component !== 'span')
                        )
                    )
                )
                .sort();

            // eslint-disable-next-line no-console
            console.log(
                `Guessed Show:

import { ${components.join(', ')} } from 'react-admin';

export const ${inflection.capitalize(
                    inflection.singularize(resource)
                )}Show = () => (
    <Show>
${inferredChild.getRepresentation()}
    </Show>
);`
            );
        }
    }, [record, child, resource]);

    return <ShowView {...props}>{child}</ShowView>;
};

ShowViewGuesser.propTypes = ShowView.propTypes;
