import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import inflection from 'inflection';
import {
    ComponentPropType,
    useListController,
    getElementsFromRecords,
    InferredElement,
    ListContextProvider,
    useListContext,
    useResourceContext,
    RaRecord,
} from 'ra-core';

import { TitlePropType } from '../layout/Title';
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
export const ListGuesser = <RecordType extends RaRecord = any>() => {
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

ListViewGuesser.propTypes = {
    // @ts-ignore-line
    actions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    aside: PropTypes.element,
    children: PropTypes.element,
    className: PropTypes.string,
    component: ComponentPropType,
    // @ts-ignore-line
    sort: PropTypes.shape({
        field: PropTypes.string.isRequired,
        order: PropTypes.string.isRequired,
    }),
    data: PropTypes.any,
    defaultTitle: PropTypes.string,
    displayedFilters: PropTypes.object,
    emptyWhileLoading: PropTypes.bool,
    // @ts-ignore-line
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filterDefaultValues: PropTypes.object,
    filters: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]),
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    hideFilter: PropTypes.func,
    ids: PropTypes.array,
    loading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    onUnselectItems: PropTypes.func,
    page: PropTypes.number,
    // @ts-ignore-line
    pagination: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    perPage: PropTypes.number,
    refresh: PropTypes.func,
    resource: PropTypes.string,
    selectedIds: PropTypes.array,
    setFilters: PropTypes.func,
    setPage: PropTypes.func,
    setPerPage: PropTypes.func,
    setSort: PropTypes.func,
    showFilter: PropTypes.func,
    title: TitlePropType,
    total: PropTypes.number,
};
