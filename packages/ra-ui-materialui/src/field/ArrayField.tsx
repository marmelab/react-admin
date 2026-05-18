import * as React from 'react';
import { ArrayFieldBase, type ArrayFieldBaseProps } from 'ra-core';

import type { FieldProps } from './types';

/**
 * Renders an embedded array of objects.
 *
 * ArrayField creates a ListContext with the field value, and renders its
 * children components - usually iterator components.
 *
 * @example
 * const PostShow = () => (
 *    <Show>
 *       <SimpleShowLayout>
 *           <ArrayField source="tags">
 *              <SingleFieldList>
 *                 <ChipField source="name" />
 *             </SingleFieldList>
 *           </ArrayField>
 *      </SimpleShowLayout>
 *   </Show>
 * );
 *
 * @see useListContext
 */
export const ArrayField = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    props: ArrayFieldProps<RecordType>
) => <ArrayFieldBase<RecordType> {...props} />;

export interface ArrayFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends ArrayFieldBaseProps<RecordType>,
        FieldProps<RecordType> {}
