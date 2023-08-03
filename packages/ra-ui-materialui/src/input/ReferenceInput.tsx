import React, { Children, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    ChoicesContextProvider,
    useReferenceInputController,
    InputProps,
    ResourceContextProvider,
    UseReferenceInputControllerParams,
} from 'ra-core';

import { AutocompleteInput } from './AutocompleteInput';

/**
 * An Input component for choosing a reference record. Useful for foreign keys.
 *
 * This component fetches the possible values in the reference resource
 * (using `dataProvider.getList()`), then renders an `<AutocompleteInput>`,
 * to which it passes the possible choices via a `ChoicesContext`.
 *
 * You can pass a child select component to customize the way the reference
 * selector is displayed (e.g. using `<SelectInput>` or `<RadioButtonGroupInput>`
 * instead of `<AutocompleteInput>`).
 *
 * @example // default selector: AutocompleteInput
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <ReferenceInput label="Post" source="post_id" reference="posts" />
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example // using a SelectInput as selector
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <ReferenceInput label="Post" source="post_id" reference="posts">
 *                 <SelectInput optionText="title" />
 *             </ReferenceInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceInput source="post_id" reference="posts" perPage={100}/>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      sort={{ field: 'title', order: 'ASC' }}
 * />
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      filter={{ is_published: true }}
 * />
 *
 * The enclosed component may filter results. ReferenceInput create a ChoicesContext which provides
 * a `setFilters` function. You can call this function to filter the results.
 */
export const ReferenceInput = (props: ReferenceInputProps) => {
    const {
        children = defaultChildren,
        reference,
        sort = { field: 'id', order: 'DESC' },
        filter = {},
    } = props;

    const controllerProps = useReferenceInputController({
        ...props,
        sort,
        filter,
    });

    if (Children.count(children) !== 1) {
        throw new Error('<ReferenceInput> only accepts a single child');
    }

    return (
        <ResourceContextProvider value={reference}>
            <ChoicesContextProvider value={controllerProps}>
                {children}
            </ChoicesContextProvider>
        </ResourceContextProvider>
    );
};

ReferenceInput.propTypes = {
    children: PropTypes.element,
    filter: PropTypes.object,
    label: PropTypes.string,
    page: PropTypes.number,
    perPage: PropTypes.number,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
};

const defaultChildren = <AutocompleteInput />;

export interface ReferenceInputProps
    extends InputProps,
        UseReferenceInputControllerParams {
    children?: ReactElement;
    label?: string;
    [key: string]: any;
}
