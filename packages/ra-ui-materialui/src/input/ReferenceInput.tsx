import React, {
    Children,
    cloneElement,
    FunctionComponent,
    ReactElement,
} from 'react';
import PropTypes from 'prop-types';
import { useInput, useReferenceInputController, InputProps } from 'ra-core';

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
 * (using the `CRUD_GET_MATCHING` REST method), then delegates rendering
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
export const ReferenceInput: FunctionComponent<Props & InputProps> = ({
    onBlur,
    onChange,
    onFocus,
    validate,
    ...props
}) => {
    const inputProps = useInput({
        onBlur,
        onChange,
        onFocus,
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
    filterToQuery: searchText => ({ q: searchText }),
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
};

const sanitizeRestProps = ({
    allowEmpty,
    basePath,
    choices,
    className,
    component,
    crudGetMatching,
    crudGetOne,
    defaultValue,
    filter,
    filterToQuery,
    formClassName,
    initializeForm,
    input,
    isRequired,
    label,
    locale,
    meta,
    onChange,
    optionValue,
    optionText,
    perPage,
    record,
    reference,
    referenceSource,
    resource,
    setFilter,
    setPagination,
    setSort,
    sort,
    source,
    textAlign,
    translateChoice,
    validation,
    ...rest
}: any) => rest;

export const ReferenceInputView = ({
    allowEmpty,
    basePath,
    children,
    choices,
    classes,
    className,
    error = undefined,
    helperText = undefined,
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
    warning = undefined,
    ...rest
}) => {
    if (Children.count(children) !== 1) {
        throw new Error('<ReferenceInput> only accepts a single child');
    }

    if (loading) {
        return (
            <Labeled
                label={label}
                source={source}
                resource={resource}
                className={className}
                isRequired={isRequired}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    if (error) {
        return <ReferenceError label={label} error={error} />;
    }

    return cloneElement(children, {
        allowEmpty,
        classes,
        className,
        input,
        isRequired,
        label,
        resource,
        helperText: warning || helperText,
        meta,
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

ReferenceInputView.propTypes = {
    allowEmpty: PropTypes.bool,
    basePath: PropTypes.string,
    children: PropTypes.element,
    choices: PropTypes.array,
    classes: PropTypes.object,
    className: PropTypes.string,
    error: PropTypes.string,
    input: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    resource: PropTypes.string.isRequired,
    setFilter: PropTypes.func,
    setPagination: PropTypes.func,
    setSort: PropTypes.func,
    source: PropTypes.string,
    warning: PropTypes.string,
};

export default ReferenceInput;
