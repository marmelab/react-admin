import React, { useState, useEffect } from 'react';
import inflection from 'inflection';
import {
    useListController,
    getElementsFromRecords,
    InferredElement,
} from 'ra-core';

import { ListView } from './List';
import listFieldTypes from './listFieldTypes';

const ListViewGuesser = props => {
    const { ids, data, resource } = props;
    const [inferredChild, setInferredChild] = useState(null);
    useEffect(() => {
        if (ids.length > 0 && data && !inferredChild) {
            const inferredElements = getElementsFromRecords(
                ids.map(id => data[id]),
                listFieldTypes
            );
            const inferredChild = new InferredElement(
                listFieldTypes.table,
                null,
                inferredElements
            );

            process.env.NODE_ENV !== 'production' &&
                // eslint-disable-next-line no-console
                console.log(
                    `Guessed List:

export const ${inflection.capitalize(
                        inflection.singularize(resource)
                    )}List = props => (
    <List {...props}>
${inferredChild.getRepresentation()}
    </List>
);`
                );
            setInferredChild(inferredChild.getElement());
        }
    }, [data, ids, inferredChild, resource]);

    return <ListView {...props}>{inferredChild}</ListView>;
};

ListViewGuesser.propTypes = ListView.propTypes;

const ListGuesser = props => (
    <ListViewGuesser {...props} {...useListController(props)} />
);

export default ListGuesser;
