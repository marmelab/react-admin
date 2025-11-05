import * as React from 'react';
import { InputProps } from '../../form/useInput';
import {
    useReferenceArrayInputController,
    type UseReferenceArrayInputParams,
} from './useReferenceArrayInputController';
import { ResourceContextProvider } from '../../core/ResourceContextProvider';
import { ChoicesContextProvider } from '../../form/choices/ChoicesContextProvider';
import { ChoicesContextValue } from '../../form/choices/ChoicesContext';
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
 * ReferenceArrayInputBase component fetches the current resources (using
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
 *             <ReferenceArrayInputBase source="tag_ids" reference="tags">
 *                 <SelectArrayInput optionText="name" />
 *             </ReferenceArrayInputBase>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceArrayInputBase
 *      source="tag_ids"
 *      reference="tags"
 *      perPage={100}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInputBase>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceArrayInputBase
 *      source="tag_ids"
 *      reference="tags"
 *      sort={{ field: 'name', order: 'ASC' }}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInputBase>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceArrayInputBase
 *      source="tag_ids"
 *      reference="tags"
 *      filter={{ is_public: true }}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInputBase>
 *
 * The enclosed component may filter results. ReferenceArrayInputBase create a ChoicesContext which provides
 * a `setFilters` function. You can call this function to filter the results.
 */
export const ReferenceArrayInputBase = <RecordType extends RaRecord = any>(
    props: ReferenceArrayInputBaseProps<RecordType>
) => {
    const {
        children,
        filter = defaultFilter,
        offline,
        reference,
        render,
        sort,
    } = props;
    if (children && React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceArrayInputBase> only accepts a single child (like <AutocompleteArrayInput>)'
        );
    }

    if (!render && !children) {
        throw new Error(
            "<ReferenceArrayInputBase> requires either a 'render' prop or 'children' prop"
        );
    }

    const controllerProps = useReferenceArrayInputController({
        ...props,
        sort,
        filter,
    });
    const { isPaused, isPending } = controllerProps;
    // isPending is true: there's no cached data and no query attempt was finished yet
    // isPaused is true: the query was paused (e.g. due to a network issue)
    // Both true: we're offline and have no data to show
    const shouldRenderOffline =
        isPaused && isPending && offline !== undefined && offline !== false;

    return (
        <ResourceContextProvider value={reference}>
            <ChoicesContextProvider value={controllerProps}>
                {shouldRenderOffline
                    ? offline
                    : render
                      ? render(controllerProps)
                      : children}
            </ChoicesContextProvider>
        </ResourceContextProvider>
    );
};

const defaultFilter = {};

export interface ReferenceArrayInputBaseProps<RecordType extends RaRecord = any>
    extends InputProps,
        UseReferenceArrayInputParams<RecordType> {
    children?: React.ReactNode;
    render?: (context: ChoicesContextValue<RecordType>) => React.ReactNode;
    offline?: React.ReactNode;
}
