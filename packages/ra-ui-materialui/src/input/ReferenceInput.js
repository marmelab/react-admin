import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { addField, translate, ReferenceInputController } from 'ra-core';

import LinearProgress from '../layout/LinearProgress';
import Labeled from './Labeled';
import ReferenceError from './ReferenceError';

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
    translate,
    translateChoice,
    validation,
    ...rest
}) => rest;

export const ReferenceInputView = ({
    allowEmpty,
    basePath,
    children,
    choices,
    classes,
    className,
    error,
    input,
    isRequired,
    isLoading,
    label,
    meta,
    onChange,
    resource,
    setFilter,
    setPagination,
    setSort,
    source,
    translate,
    warning,
    ...rest
}) => {
    if (isLoading) {
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

    return React.cloneElement(children, {
        allowEmpty,
        classes,
        className,
        input,
        isRequired,
        label,
        resource,
        meta: {
            ...meta,
            helperText: warning || false,
        },
        source,
        choices,
        basePath,
        onChange,
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
    isLoading: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    resource: PropTypes.string.isRequired,
    setFilter: PropTypes.func,
    setPagination: PropTypes.func,
    setSort: PropTypes.func,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
    warning: PropTypes.string,
};

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
export const ReferenceInput = ({ children, ...props }) => {
    if (React.Children.count(children) !== 1) {
        throw new Error('<ReferenceInput> only accepts a single child');
    }

    return (
        <ReferenceInputController {...props}>
            {controllerProps => (
                <ReferenceInputView
                    {...props}
                    {...{ children, ...controllerProps }}
                />
            )}
        </ReferenceInputController>
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
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    perPage: PropTypes.number,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

ReferenceInput.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => ({ q: searchText }),
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
};

const EnhancedReferenceInput = compose(
    addField,
    translate
)(ReferenceInput);

export default EnhancedReferenceInput;
