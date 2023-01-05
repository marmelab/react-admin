import * as React from 'react';
import { useState, useEffect } from 'react';
import inflection from 'inflection';
import {
    ListBase,
    getElementsFromRecords,
    InferredElement,
    useListContext,
    useResourceContext,
    RaRecord,
    useResourceDefinition,
} from 'ra-core';

import { ListProps } from './List';
import { ListView, ListViewProps } from './ListView';
import { listFieldTypes } from './listFieldTypes';

/**
 * List component rendering a <Datagrid> based on the result of the
 * dataProvider.getList() call.
 *
 * The result (choice and type of columns) isn't configurable, but the
 * <ListGuesser> outputs the <Datagrid> it has guessed to the console so that
 * developers can start from there.
 *
 * To be used as the list prop of a <Resource>.
 *
 * @example
 *
 * import { Admin, Resource, ListGuesser } from 'react-admin';
 *
 * const App = () => (
 *     <Admin dataProvider={myDataProvider}>
 *         <Resource name="posts" list={ListGuesser} />
 *     </Admin>
 * );
 */
export const ListGuesser = <RecordType extends RaRecord = any>(
    props: Omit<ListProps, 'children'>
) => {
    const {
        debounce,
        disableAuthentication,
        disableSyncWithLocation,
        exporter,
        filter,
        filterDefaultValues,
        perPage,
        queryOptions,
        resource,
        sort,
        ...rest
    } = props;
    return (
        <ListBase<RecordType>
            debounce={debounce}
            disableAuthentication={disableAuthentication}
            disableSyncWithLocation={disableSyncWithLocation}
            exporter={exporter}
            filter={filter}
            filterDefaultValues={filterDefaultValues}
            perPage={perPage}
            queryOptions={{ keepPreviousData: false }}
            resource={resource}
            sort={sort}
        >
            <ListViewGuesser {...rest} />
        </ListBase>
    );
};

const ListViewGuesser = (props: Omit<ListViewProps, 'children'>) => {
    const { data } = useListContext(props);
    const resource = useResourceContext();
    const { hasEdit, hasShow } = useResourceDefinition(props);
    const [child, setChild] = useState(null);

    useEffect(() => {
        setChild(null);
    }, [resource]);

    useEffect(() => {
        if (data && data.length > 0 && !child) {
            const inferredElements = getElementsFromRecords(
                data,
                listFieldTypes
            );
            const inferredChild = new InferredElement(
                listFieldTypes.table,
                { hasEdit, hasShow },
                inferredElements
            );
            setChild(inferredChild.getElement());

            if (process.env.NODE_ENV === 'production') return;

            const representation = inferredChild.getRepresentation();
            const components = ['List']
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
                `Guessed List:

import { ${components.join(', ')} } from 'react-admin';

export const ${inflection.capitalize(
                    inflection.singularize(resource)
                )}List = () => (
    <List>
${inferredChild.getRepresentation()}
    </List>
);`
            );
        }
    }, [data, child, resource, hasEdit, hasShow]);

    return <ListView {...props}>{child}</ListView>;
};

ListViewGuesser.propTypes = ListView.propTypes;
