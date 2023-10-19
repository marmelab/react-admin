import * as React from 'react';
import { ReactNode } from 'react';
import get from 'lodash/get';
import {
    ListContextProvider,
    useRecordContext,
    useList,
    SortPayload,
    FilterPayload,
} from 'ra-core';

import { FieldProps, fieldPropTypes } from './types';
import { genericMemo } from './genericMemo';

/**
 * Renders an embedded array of objects.
 *
 * ArrayField creates a ListContext with the field value, and renders its children components -
 * usually iterator components like Datagrid, SingleFieldList, or SimpleList.
 *
 * @example // Display all the tags of the current post as `<Chip>` components
 * // const post = {
 * //   id: 123
 * //   tags: [
 * //     { name: 'foo' },
 * //     { name: 'bar' }
 * //   ]
 * // };
 * const PostShow = () => (
 *    <Show>
 *       <SimpleShowLayout>
 *           <ArrayField source="tags">
 *               <SingleFieldList>
 *                   <ChipField source="name" />
 *               </SingleFieldList>
 *           </ArrayField>
 *      </SimpleShowLayout>
 *   </Show>
 * );
 *
 * @example // Display all the backlinks of the current post as a `<Datagrid>`
 * // const post = {
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
 * // };
 * <ArrayField source="backlinks">
 *     <Datagrid>
 *         <DateField source="date" />
 *         <UrlField source="url" />
 *     </Datagrid>
 * </ArrayField>
 *
 * @example // If you need to render a collection of strings, it's often simpler to write your own component
 * const TagsField = () => {
 *     const record = useRecordContext();
 *     return (
 *         <ul>
 *             {record.tags.map(item => (
 *                 <li key={item.name}>{item.name}</li>
 *             ))}
 *         </ul>
 *     );
 * };
 *
 * @see useListContext
 */
const ArrayFieldImpl = <
    RecordType extends Record<string, any> = Record<string, any>
>(
    props: ArrayFieldProps<RecordType>
) => {
    const { children, resource, source, perPage, sort, filter } = props;
    const record = useRecordContext(props);
    const data =
        (get(record, source, emptyArray) as Record<string, any>[]) ||
        emptyArray;
    const listContext = useList({ data, resource, perPage, sort, filter });
    return (
        <ListContextProvider value={listContext}>
            {children}
        </ListContextProvider>
    );
};
ArrayFieldImpl.propTypes = { ...fieldPropTypes };
ArrayFieldImpl.displayName = 'ArrayFieldImpl';

export const ArrayField = genericMemo(ArrayFieldImpl);

export interface ArrayFieldProps<
    RecordType extends Record<string, any> = Record<string, any>
> extends FieldProps<RecordType> {
    children?: ReactNode;
    perPage?: number;
    sort?: SortPayload;
    filter?: FilterPayload;
}

const emptyArray = [];
