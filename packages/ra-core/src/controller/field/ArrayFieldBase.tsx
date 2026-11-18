import * as React from 'react';
import { type ReactNode, useMemo } from 'react';

import { useResourceContext } from '../../core';
import type { Exporter, FilterPayload, SortPayload } from '../../types';
import { genericMemo } from '../../util/genericMemo';
import { useFieldValue } from '../../util/useFieldValue';
import { ListContextProvider, useList } from '../list';
import { useRecordContext } from '../record';
import type { BaseFieldProps } from './types';

/**
 * Renders an embedded array of objects.
 *
 * ArrayFieldBase creates a ListContext with the field value, and renders its
 * children components - usually iterator components.
 *
 * @example
 * const PostShow = () => (
 *    <ShowBase>
 *       <ArrayFieldBase source="tags">
 *          <ul>
 *              <RecordsIterator
 *                  render={record => <li key={record.id}>{record.name}</li>}
 *              />
 *          </ul>
 *       </ArrayFieldBase>
 *   </ShowBase>
 * );
 *
 * @see useListContext
 */
const ArrayFieldBaseImpl = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    props: ArrayFieldBaseProps<RecordType>
) => {
    const { children, source, perPage, sort, filter, exporter } = props;
    const data = useFieldValue(props) || emptyArray;
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const listContext = useList({
        data,
        // the items aren't records of the resource, so they get their own selection
        resource: resource && `${resource}.${source}.${record?.id}`,
        perPage,
        sort,
        filter,
        exporter,
    });

    // ignore the selected items that are no longer in the array
    const selectedIds = useMemo(
        () =>
            listContext.selectedIds.filter(id =>
                data.some(item => item.id === id)
            ),
        [data, listContext.selectedIds]
    );

    return (
        <ListContextProvider
            value={{
                ...listContext,
                selectedIds,
                disableDefaultBulkActions: true,
            }}
        >
            {children}
        </ListContextProvider>
    );
};

ArrayFieldBaseImpl.displayName = 'ArrayFieldBaseImpl';

export const ArrayFieldBase = genericMemo(ArrayFieldBaseImpl);

export interface ArrayFieldBaseProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends BaseFieldProps<RecordType> {
    children?: ReactNode;
    perPage?: number;
    sort?: SortPayload;
    filter?: FilterPayload;
    exporter?: Exporter<any> | false;
}

const emptyArray = [];
