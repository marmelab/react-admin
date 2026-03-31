import * as React from 'react';
import { type ReactNode } from 'react';

import type { Exporter, FilterPayload, SortPayload } from '../../types';
import { genericMemo } from '../../util/genericMemo';
import { useFieldValue } from '../../util/useFieldValue';
import { ListContextProvider, useList } from '../list';
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
    const { children, resource, perPage, sort, filter, exporter } = props;
    const data = useFieldValue(props) || emptyArray;
    const listContext = useList({
        data,
        resource,
        perPage,
        sort,
        filter,
        exporter,
    });

    return (
        <ListContextProvider value={listContext}>
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
