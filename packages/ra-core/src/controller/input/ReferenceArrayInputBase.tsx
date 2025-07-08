import * as React from 'react';
import { InputProps } from '../../form/types';
import {
    useReferenceArrayInputController,
    type UseReferenceArrayInputParams,
} from './useReferenceArrayInputController';
import { ResourceContextProvider } from '../../core/ResourceContextProvider';
import { ChoicesContextProvider } from '../../form/choices/ChoicesContextProvider';
import { RaRecord } from '../../types';

/**
 * An Input component for fields containing a list of references to another resource.
 * Useful for 'hasMany' relationship.
 *
 * @example
 * The post object has many tags, so the post resource looks like:
 * {
 *    id: 1234,
 *    tag_ids: [ "1", "23", "4" ]
 * }
 *
 * ReferenceArrayInput component fetches the current resources (using
 * `dataProvider.getMany()`) as well as possible resources (using
 * `dataProvider.getList()`) in the reference endpoint. It then
 * delegates rendering to its child component, to which it makes the possible
 * choices available through the ChoicesContext.
 *
 * Use it with a selector component as child, like `<SelectArrayInput>`
 * or <CheckboxGroupInput>.
 *
 * @example
 * export const PostEdit = () => (
 *     <Edit>
 *         <SimpleForm>
 *             <ReferenceArrayInput source="tag_ids" reference="tags">
 *                 <SelectArrayInput optionText="name" />
 *             </ReferenceArrayInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      perPage={100}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      sort={{ field: 'name', order: 'ASC' }}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      filter={{ is_public: true }}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 *
 * The enclosed component may filter results. ReferenceArrayInput create a ChoicesContext which provides
 * a `setFilters` function. You can call this function to filter the results.
 */
export const ReferenceArrayInputBase = <RecordType extends RaRecord = any>(
    props: ReferenceArrayInputBaseProps<RecordType>
) => {
    const { children, reference, sort, filter = defaultFilter } = props;
    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceArrayInputBase> only accepts a single child (like <Datagrid>)'
        );
    }

    const controllerProps = useReferenceArrayInputController({
        ...props,
        sort,
        filter,
    });

    return (
        <ResourceContextProvider value={reference}>
            <ChoicesContextProvider value={controllerProps}>
                {children}
            </ChoicesContextProvider>
        </ResourceContextProvider>
    );
};

const defaultFilter = {};

export interface ReferenceArrayInputBaseProps<RecordType extends RaRecord = any>
    extends InputProps,
        UseReferenceArrayInputParams<RecordType> {
    children: React.ReactNode;
}
