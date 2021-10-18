import { ComponentType, ReactElement, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { Record, SortPayload, PaginationPayload } from '../../types';
import { useReferenceArrayInputController } from './useReferenceArrayInputController';
import { ListControllerProps } from '..';

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
 * `dataProvider.getList()` REST method) in the reference endpoint. It then
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
const ReferenceArrayInputController = ({
    basePath,
    children,
    filter = {},
    input,
    filterToQuery = searchText => ({ q: searchText }),
    perPage = 25,
    reference,
    resource,
    sort = { field: 'id', order: 'DESC' },
    source,
    enableGetChoices,
}: ReferenceArrayInputControllerProps) => {
    const { setFilter, ...controllerProps } = useReferenceArrayInputController({
        basePath,
        filter,
        filterToQuery,
        input,
        perPage,
        sort,
        reference,
        resource,
        source,
        enableGetChoices,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetFilter = useCallback(debounce(setFilter, 500), [
        setFilter,
    ]);

    return children({
        ...controllerProps,
        setFilter: debouncedSetFilter,
    });
};

export interface ReferenceArrayInputControllerChildrenFuncParams
    extends Omit<ListControllerProps, 'setSort'> {
    choices: Record[];
    error?: string;
    loaded: boolean;
    loading: boolean;
    setFilter: (filter: any) => void;
    setPagination: (pagination: PaginationPayload) => void;
    setSort: (sort: SortPayload) => void;
    setSortForList: (sort: string, order?: string) => void;
    warning?: string;
}

interface ReferenceArrayInputControllerProps {
    allowEmpty?: boolean;
    basePath: string;
    children: (
        params: ReferenceArrayInputControllerChildrenFuncParams
    ) => ReactElement;
    filter?: object;
    filterToQuery?: (filter: {}) => any;
    input?: any;
    meta?: object;
    perPage?: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: SortPayload;
    source: string;
    enableGetChoices?: (filters: any) => boolean;
}

export default ReferenceArrayInputController as ComponentType<
    ReferenceArrayInputControllerProps
>;
