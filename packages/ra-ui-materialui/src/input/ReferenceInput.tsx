import React, {
    Children,
    cloneElement,
    FunctionComponent,
    ReactElement,
} from 'react';
import PropTypes from 'prop-types';
import { FieldInputProps, FieldMetaState } from 'react-final-form';
import {
    useInput,
    useReferenceInputController,
    InputProps,
    Pagination,
    Sort,
} from 'ra-core';

import sanitizeInputProps from './sanitizeRestProps';
import LinearProgress from '../layout/LinearProgress';
import Labeled from './Labeled';
import ReferenceError from './ReferenceError';

interface Props {
    allowEmpty: boolean;
    basePath: string;
    children: ReactElement;
    classes: any;
    className: string;
    label: string;
    reference: string;
    resource: string;
    [key: string]: any;
}
/**
 * An Input component for choosing a reference record. Useful for foreign keys.
 *
 * This component fetches the possible values in the reference resource
 * (using `dataProvider.getMatching()`), then delegates rendering
 * to a subcomponent, to which it passes the possible choices
 * as the `choices` attribute.
 *
 * Use it with a selector component as child, like `<AutocompleteInput>`,
 * `<SelectInput>`, or `<RadioButtonGroupInput>`.
 *
 * @example
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <ReferenceInput label="Post" source="post_id" reference="posts">
 *                 <AutocompleteInput optionText="title" />
 *             </ReferenceInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example
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
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      perPage={100}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      sort={{ field: 'title', order: 'ASC' }}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      filter={{ is_published: true }}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 *
 * The enclosed component may filter results. ReferenceInput passes a `setFilter`
 * function as prop to its child component. It uses the value to create a filter
 * for the query - by default { q: [searchText] }. You can customize the mapping
 * searchText => searchQuery by setting a custom `filterToQuery` function prop:
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      filterToQuery={searchText => ({ title: searchText })}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 */
const ReferenceInput: FunctionComponent<Props & InputProps> = ({
    format,
    onBlur,
    onChange,
    onFocus,
    parse,
    validate,
    ...props
}) => {
    const inputProps = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        validate,
        ...props,
    });
    return (
        <ReferenceInputView
            {...inputProps}
            {...props}
            {...useReferenceInputController({ ...props, ...inputProps })}
        />
    );
};

ReferenceInput.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object,
    filter: PropTypes.object,
    filterToQuery: PropTypes.func.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
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

ReferenceInput.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => (searchText ? { q: searchText } : {}),
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
};

const sanitizeRestProps = ({
    choices,
    className,
    crudGetMatching,
    crudGetOne,
    filter,
    filterToQuery,
    onChange,
    perPage,
    reference,
    referenceSource,
    setFilter,
    setPagination,
    setSort,
    sort,
    validation,
    ...rest
}: any) => sanitizeInputProps(rest);

interface ReferenceInputViewProps {
    allowEmpty?: boolean;
    basePath: string;
    children: ReactElement;
    choices: any[];
    classes?: object;
    className?: string;
    error?: string;
    helperText?: string;
    id: string;
    input: FieldInputProps<any, HTMLElement>;
    isRequired: boolean;
    label: string;
    loading: boolean;
    meta: FieldMetaState<any>;
    reference: string;
    resource: string;
    setFilter: (v: string) => void;
    setPagination: (pagination: Pagination) => void;
    setSort: (sort: Sort) => void;
    source: string;
    warning?: string;
}

export const ReferenceInputView: FunctionComponent<ReferenceInputViewProps> = ({
    allowEmpty,
    basePath,
    children,
    choices,
    classes,
    className,
    error,
    helperText,
    id,
    input,
    isRequired,
    loading,
    label,
    meta,
    resource,
    setFilter,
    setPagination,
    setSort,
    source,
    warning,
    ...rest
}) => {
    if (Children.count(children) !== 1) {
        throw new Error('<ReferenceInput> only accepts a single child');
    }

    if (loading) {
        return (
            <Labeled
                id={id}
                label={label}
                source={source}
                resource={resource}
                className={className}
                isRequired={isRequired}
                meta={meta}
                input={input}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    // This is not a final-form error but an unrecoverable error from the
    // useReferenceInputController hook
    if (error) {
        return <ReferenceError label={label} error={error} />;
    }

    // When the useReferenceInputController returns a warning, it means there it
    // had an issue trying to load the referenced record
    // We display it by overriding the final-form meta
    const finalMeta = warning
        ? {
              ...meta,
              error: warning,
          }
        : meta;

    return cloneElement(children, {
        allowEmpty,
        classes,
        className,
        input,
        isRequired,
        label,
        resource,
        meta: finalMeta,
        source,
        choices,
        basePath,
        setFilter,
        setPagination,
        setSort,
        translateChoice: false,
        ...sanitizeRestProps(rest),
    });
};

export default ReferenceInput;
