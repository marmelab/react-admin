import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    InputProps,
    useReferenceArrayInputController,
    ResourceContextProvider,
    ChoicesContextProvider,
} from 'ra-core';

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
 * delegates rendering to a subcomponent, to which it passes the possible
 * choices as the `choices` attribute.
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
 * The enclosed component may filter results. ReferenceArrayInput passes a
 * `setFilter` function as prop to its child component. It uses the value to
 * create a filter for the query - by default { q: [searchText] }. You can
 * customize the mapping searchText => searchQuery by setting a custom
 * `filterToQuery` function prop:
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      filterToQuery={searchText => ({ name: searchText })}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 */
export const ReferenceArrayInput = ({
    children,
    ...props
}: ReferenceArrayInputProps) => {
    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceArrayInput> only accepts a single child (like <Datagrid>)'
        );
    }

    const controllerProps = useReferenceArrayInputController(props);
    return (
        <ResourceContextProvider value={props.reference}>
            <ChoicesContextProvider value={controllerProps}>
                {children}
            </ChoicesContextProvider>
        </ResourceContextProvider>
    );
};

ReferenceArrayInput.propTypes = {
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    filter: PropTypes.object,
    filterToQuery: PropTypes.func.isRequired,
    label: PropTypes.string,
    perPage: PropTypes.number,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
};

ReferenceArrayInput.defaultProps = {
    filter: {},
    filterToQuery: searchText => (searchText ? { q: searchText } : {}),
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
};

export interface ReferenceArrayInputProps extends InputProps {
    children: ReactElement;
    className?: string;
    label?: string;
    reference: string;
    resource?: string;
    enableGetChoices?: (filters: any) => boolean;
    [key: string]: any;
}
