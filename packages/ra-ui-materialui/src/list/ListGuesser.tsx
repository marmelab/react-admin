import * as React from 'react';
import { useState, useEffect } from 'react';
import inflection from 'inflection';
import {
    useListController,
    getElementsFromRecords,
    InferredElement,
    ListContextProvider,
    useListContext,
    useResourceContext,
    Record,
    ListControllerProps,
} from 'ra-core';

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
export const ListGuesser = <RecordType extends Record = Record>() => {
    const controllerProps = useListController<RecordType>();
    return (
        <ListContextProvider value={controllerProps}>
            <ListViewGuesser {...controllerProps} />
        </ListContextProvider>
    );
};

const ListViewGuesser = (props: Omit<ListViewProps, 'children'>) => {
    const { data } = useListContext(props);
    const resource = useResourceContext();
    const [inferredChild, setInferredChild] = useState(null);
    useEffect(() => {
        if (data && data.length > 0 && !inferredChild) {
            const inferredElements = getElementsFromRecords(
                data,
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
    }, [data, inferredChild, resource]);

    return <ListView {...props}>{inferredChild}</ListView>;
};

ListViewGuesser.propTypes = ListView.propTypes;
