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
export const ArrayField = ArrayFieldBase;

export interface ArrayFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends ArrayFieldBaseProps<RecordType>,
        FieldProps<RecordType> {}
