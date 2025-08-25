import React, { ReactNode } from 'react';

import { ResourceContextProvider } from '../../core';
import { ChoicesContextProvider, InputProps } from '../../form';
import {
    UseReferenceInputControllerParams,
    useReferenceInputController,
} from './useReferenceInputController';

/**
 * An Input component for choosing a reference record. Useful for foreign keys.
 *
 * This component fetches the possible values in the reference resource
 * (using `dataProvider.getList()`), and renders the child you passed
 * to which it passes the possible choices via a `ChoicesContext`.
 *
 * You must pass a child selection component to customize the way the reference
 * selector is displayed (e.g. using `<SelectInput>` or `<RadioButtonGroupInput>`
 * instead of `<AutocompleteInput>` ).
 *
 * Note that the child component should handle the error and loading cases as this base component does not.
 *
 * @example // using a SelectInput as selector
 * export const CommentEdit = () => (
 *     <Edit>
 *         <SimpleForm>
 *             <ReferenceInputBase label="Post" source="post_id" reference="posts">
 *                 <SelectInput optionText="title" />
 *             </ReferenceInputBase>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceInputBase source="post_id" reference="posts" perPage={100}/>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceInputBase
 *      source="post_id"
 *      reference="posts"
 *      sort={{ field: 'title', order: 'ASC' }}
 * >
 *     <SelectInput optionText="title" />
 * </ReferenceInputBase>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceInputBase
 *      source="post_id"
 *      reference="posts"
 *      filter={{ is_published: true }}
 * >
 *      <SelectInput optionText="title" />
 * </ReferenceInputBase>
 *
 * The enclosed component may filter results. ReferenceInputBase create a ChoicesContext which provides
 * a `setFilters` function. You can call this function to filter the results.
 */
export const ReferenceInputBase = (props: ReferenceInputBaseProps) => {
    const {
        children,
        reference,
        sort = { field: 'id', order: 'DESC' },
        filter = {},
        offline,
    } = props;

    const controllerProps = useReferenceInputController({
        ...props,
        sort,
        filter,
    });

    const { isPaused, allChoices } = controllerProps;

    const shouldRenderOffline =
        isPaused &&
        // TODO v6: we can't rely on isPlaceHolderData here because useReferenceInputController always return at least an empty array
        allChoices?.length === 0 &&
        offline !== false &&
        offline !== undefined;

    return (
        <ResourceContextProvider value={reference}>
            <ChoicesContextProvider value={controllerProps}>
                {shouldRenderOffline ? offline : children}
            </ChoicesContextProvider>
        </ResourceContextProvider>
    );
};

export interface ReferenceInputBaseProps
    extends InputProps,
        UseReferenceInputControllerParams {
    children?: ReactNode;
    offline?: ReactNode;
}
