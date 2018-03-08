import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { addField, translate, ReferenceArrayInputController } from 'ra-core';

import LinearProgress from '../layout/LinearProgress';
import Labeled from '../input/Labeled';
import ReferenceError from './ReferenceError';

const sanitizeRestProps = ({
    alwaysOn,
    basePath,
    component,
    crudGetMany,
    crudGetMatching,
    defaultValue,
    filterToQuery,
    formClassName,
    initializeForm,
    input,
    isRequired,
    label,
    locale,
    meta,
    optionText,
    optionValue,
    perPage,
    record,
    referenceSource,
    resource,
    allowEmpty,
    source,
    textAlign,
    translate,
    translateChoice,
    ...rest
}) => rest;

export const ReferenceArrayInputView = ({
    allowEmpty,
    basePath,
    children,
    choices,
    className,
    error,
    input,
    isLoading,
    label = '',
    meta,
    onChange,
    options,
    resource,
    setFilter,
    setPagination,
    setSort,
    source,
    translate,
    warning,
    ...rest
}) => {
    const translatedLabel = translate(
        label || `resources.${resource}.fields.${source}`,
        { _: label }
    );

    if (isLoading) {
        return (
            <Labeled
                label={translatedLabel}
                source={source}
                resource={resource}
                className={className}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    if (error) {
        return <ReferenceError label={translatedLabel} error={error} />;
    }

    return React.cloneElement(children, {
        allowEmpty,
        basePath,
        choices,
        className,
        error,
        input,
        label: translatedLabel,
        meta: {
            ...meta,
            helperText: warning || false,
        },
        onChange,
        options,
        resource,
        setFilter,
        setPagination,
        setSort,
        source,
        translateChoice: false,
        ...sanitizeRestProps(rest),
    });
};

ReferenceArrayInputView.propTypes = {
    allowEmpty: PropTypes.bool,
    basePath: PropTypes.string,
    children: PropTypes.element,
    choices: PropTypes.array,
    className: PropTypes.string,
    error: PropTypes.string,
    isLoading: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    options: PropTypes.object,
    resource: PropTypes.string.isRequired,
    setFilter: PropTypes.func,
    setPagination: PropTypes.func,
    setSort: PropTypes.func,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
    warning: PropTypes.string,
};

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
 * ReferenceArrayInput component fetches the current resources (using the
 * `CRUD_GET_MANY` REST method) as well as possible resources (using the
 * `CRUD_GET_MATCHING` REST method) in the reference endpoint. It then
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
export const ReferenceArrayInput = ({ children, ...props }) => {
    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceArrayInput> only accepts a single child (like <Datagrid>)'
        );
    }

    return (
        <ReferenceArrayInputController {...props}>
            {controllerProps => (
                <ReferenceArrayInputView
                    {...props}
                    {...{ children, ...controllerProps }}
                />
            )}
        </ReferenceArrayInputController>
    );
};

ReferenceArrayInput.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    filter: PropTypes.object,
    filterToQuery: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object,
    perPage: PropTypes.number,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

ReferenceArrayInput.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => ({ q: searchText }),
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
};

const EnhancedReferenceArrayInput = compose(addField, translate)(
    ReferenceArrayInput
);

export default EnhancedReferenceArrayInput;
