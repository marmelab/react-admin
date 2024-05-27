import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';
import {
    ShowBase,
    InferredElement,
    getElementsFromRecords,
    useResourceContext,
    useShowContext,
} from 'ra-core';
import { capitalize, singularize } from 'inflection';

import { ShowProps } from './Show';
import { ShowView } from './ShowView';
import { showFieldTypes } from './showFieldTypes';

export const ShowGuesser = ({
    id,
    queryOptions,
    resource,
    ...rest
}: Omit<ShowProps, 'children'> & { enableLog?: boolean }) => (
    <ShowBase id={id} resource={resource} queryOptions={queryOptions}>
        <ShowViewGuesser {...rest} />
    </ShowBase>
);

const ShowViewGuesser = (
    props: Omit<ShowProps, 'children'> & { enableLog?: boolean }
) => {
    const resource = useResourceContext(props);

    if (!resource) {
        throw new Error(
            `<ShowGuesser> was called outside of a ResourceContext and without a resource prop. You must set the resource prop.`
        );
    }

    const { record } = useShowContext();
    const [child, setChild] = useState<ReactNode>(null);
    const { enableLog = process.env.NODE_ENV === 'development', ...rest } =
        props;

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

            if (!enableLog) return;

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

export const ${capitalize(singularize(resource))}Show = () => (
    <Show>
${inferredChild.getRepresentation()}
    </Show>
);`
            );
        }
    }, [record, child, resource, enableLog]);

    return <ShowView {...rest}>{child}</ShowView>;
};
