import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    getFieldLabelTranslationArgs,
    InputProps,
    useReferenceArrayInputController,
    useInput,
    useTranslate,
    SortPayload,
    PaginationPayload,
    Translate,
    ResourceContextProvider,
    ReferenceArrayInputContextProvider,
    ListContextProvider,
} from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { ReferenceError } from './ReferenceError';

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
    id: idOverride,
    onBlur,
    onChange,
    onFocus,
    validate,
    parse,
    format,
    ...props
}: ReferenceArrayInputProps) => {
    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceArrayInput> only accepts a single child (like <Datagrid>)'
        );
    }

    const { field, fieldState, formState, id, isRequired } = useInput({
        id: idOverride,
        onBlur,
        onChange,
        source: props.source,
        validate,
        parse,
        format,
        ...props,
    });

    const controllerProps = useReferenceArrayInputController({
        ...props,
        field,
    });

    const translate = useTranslate();
    return (
        <ResourceContextProvider value={props.reference}>
            <ReferenceArrayInputContextProvider value={controllerProps}>
                <ListContextProvider value={controllerProps}>
                    <ReferenceArrayInputView
                        id={id}
                        field={field}
                        isRequired={isRequired}
                        fieldState={fieldState}
                        formState={formState}
                        translate={translate}
                        children={children}
                        {...props}
                        choices={controllerProps.choices}
                        isFetching={controllerProps.isFetching}
                        isLoading={controllerProps.isLoading}
                        setFilter={controllerProps.setFilter}
                        setPagination={controllerProps.setPagination}
                        setSort={controllerProps.setSort}
                    />
                </ListContextProvider>
            </ReferenceArrayInputContextProvider>
        </ResourceContextProvider>
    );
};

ReferenceArrayInput.propTypes = {
    allowEmpty: PropTypes.bool,
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

const sanitizeRestProps = ({
    filterToQuery,
    perPage,
    reference,
    referenceSource,
    resource,
    ...rest
}: any) => sanitizeInputRestProps(rest);

export type ReferenceArrayInputViewProps = CommonInputProps & {
    allowEmpty?: boolean;
    children: ReactElement;
    choices: any[];
    classes?: object;
    className?: string;
    error?: string;
    id: string;
    isFetching: boolean;
    isLoading: boolean;
    onChange: any;
    options?: any;
    reference: string;
    resource?: string;
    setFilter: (v: string) => void;
    setPagination: (pagination: PaginationPayload) => void;
    setSort: (sort: SortPayload) => void;
    translate: Translate;
    warning?: string;
};

export const ReferenceArrayInputView = ({
    allowEmpty,
    children,
    choices,
    className,
    error,
    field,
    fieldState,
    formState,
    isFetching,
    isLoading,
    isRequired,
    label,
    onChange,
    options,
    reference,
    resource,
    setFilter,
    setPagination,
    setSort,
    source,
    translate,
    warning,
    ...rest
}: ReferenceArrayInputViewProps) => {
    const translatedLabel =
        typeof label === 'string'
            ? translate(
                  ...getFieldLabelTranslationArgs({
                      label,
                      resource,
                      source,
                  })
              )
            : label;

    if (error) {
        return <ReferenceError label={translatedLabel} error={error} />;
    }

    return React.cloneElement(children, {
        allowEmpty,
        choices,
        className,
        error,
        field,
        fieldState: {
            ...fieldState,
            helperText: warning || false,
        },
        formState,
        isRequired,
        label: translatedLabel,
        isFetching,
        isLoading,
        onChange,
        options,
        resource: reference,
        setFilter,
        setPagination,
        setSort,
        source,
        translateChoice: false,
        limitChoicesToValue: true,
        ...sanitizeRestProps(rest),
        ...children.props,
    });
};

ReferenceArrayInputView.propTypes = {
    allowEmpty: PropTypes.bool,
    children: PropTypes.element,
    choices: PropTypes.array,
    className: PropTypes.string,
    error: PropTypes.string,
    loading: PropTypes.bool,
    field: PropTypes.object.isRequired,
    label: PropTypes.string,
    fieldState: PropTypes.object,
    onChange: PropTypes.func,
    options: PropTypes.object,
    resource: PropTypes.string,
    setFilter: PropTypes.func,
    setPagination: PropTypes.func,
    setSort: PropTypes.func,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
    warning: PropTypes.string,
};

export interface ReferenceArrayInputProps extends InputProps {
    allowEmpty?: boolean;
    children: ReactElement;
    className?: string;
    label?: string;
    reference: string;
    resource?: string;
    enableGetChoices?: (filters: any) => boolean;
    [key: string]: any;
}
