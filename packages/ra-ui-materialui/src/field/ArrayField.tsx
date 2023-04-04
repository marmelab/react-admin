import * as React from 'react';
import { memo, ReactNode } from 'react';
import get from 'lodash/get';
import {
    ListContextProvider,
    useRecordContext,
    useList,
    SortPayload,
    FilterPayload,
} from 'ra-core';

import { PublicFieldProps, InjectedFieldProps, fieldPropTypes } from './types';

/**
 * Display a collection
 *
 * Ideal for embedded arrays of objects, e.g.
 * {
 *   id: 123
 *   tags: [
 *     { name: 'foo' },
 *     { name: 'bar' }
 *   ]
 * }
 *
 * The child must be an iterator component
 * (like <Datagrid> or <SingleFieldList>).
 *
 * @example Display all the backlinks of the current post as a <Datagrid>
 * // post = {
 * //   id: 123
 * //   backlinks: [
 * //       {
 * //           uuid: '34fdf393-f449-4b04-a423-38ad02ae159e',
 * //           date: '2012-08-10T00:00:00.000Z',
 * //           url: 'http://example.com/foo/bar.html',
 * //       },
 * //       {
 * //           uuid: 'd907743a-253d-4ec1-8329-404d4c5e6cf1',
 * //           date: '2012-08-14T00:00:00.000Z',
 * //           url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
 * //       }
 * //    ]
 * // }
 *     <ArrayField source="backlinks">
 *         <Datagrid>
 *             <DateField source="date" />
 *             <UrlField source="url" />
 *         </Datagrid>
 *     </ArrayField>
 *
 * @example Display all the tags of the current post as <Chip> components
 * // post = {
 * //   id: 123
 * //   tags: [
 * //     { name: 'foo' },
 * //     { name: 'bar' }
 * //   ]
 * // }
 *     <ArrayField source="tags">
 *         <SingleFieldList>
 *             <ChipField source="name" />
 *         </SingleFieldList>
 *     </ArrayField>
 *
 * If you need to render a collection in a custom way, it's often simpler
 * to write your own component:
 *
 * @example
 *   const TagsField = () => {
 *       const record = useRecordContext();
 *       return (
 *           <ul>
 *               {record.tags.map(item => (
 *                   <li key={item.name}>{item.name}</li>
 *               ))}
 *           </ul>
 *       );
 *   };
 */
export const ArrayField = memo<ArrayFieldProps>(props => {
    const { children, resource, source, perPage, sort, filter } = props;
    const record = useRecordContext(props);
    const data = get(record, source, emptyArray) || emptyArray;
    const listContext = useList({ data, resource, perPage, sort, filter });
    return (
        <ListContextProvider value={listContext}>
            {children}
        </ListContextProvider>
    );
});

// @ts-ignore
ArrayField.propTypes = {
    ...fieldPropTypes,
};

export interface ArrayFieldProps extends PublicFieldProps, InjectedFieldProps {
    children: ReactNode;
    perPage?: number;
    sort?: SortPayload;
    filter?: FilterPayload;
}

ArrayField.displayName = 'ArrayField';

const emptyArray = [];
