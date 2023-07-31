import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    InputProps,
    useReferenceArrayInputController,
    ResourceContextProvider,
    ChoicesContextProvider,
    UseReferenceArrayInputParams,
} from 'ra-core';
import { AutocompleteArrayInput } from './AutocompleteArrayInput';

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
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
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
export const ReferenceArrayInput = (props: ReferenceArrayInputProps) => {
    const {
        children = defaultChildren,
        reference,
        sort,
        filter = defaultFilter,
    } = props;
    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceArrayInput> only accepts a single child (like <Datagrid>)'
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

ReferenceArrayInput.propTypes = {
    children: PropTypes.element,
    filter: PropTypes.object,
    label: PropTypes.string,
    page: PropTypes.number,
    perPage: PropTypes.number,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
};

const defaultChildren = <AutocompleteArrayInput />;
const defaultFilter = {};

export interface ReferenceArrayInputProps
    extends InputProps,
        UseReferenceArrayInputParams {
    children?: ReactElement;
    label?: string;
    [key: string]: any;
}
