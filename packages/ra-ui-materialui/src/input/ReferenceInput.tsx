import React, { Children, cloneElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    useInput,
    useReferenceInputController,
    InputProps,
    warning as warningLog,
    ListContextProvider,
    ReferenceInputValue,
    UseInputValue,
    ResourceContextProvider,
} from 'ra-core';

import sanitizeInputRestProps from './sanitizeInputRestProps';
import ReferenceError from './ReferenceError';

/**
 * An Input component for choosing a reference record. Useful for foreign keys.
 *
 * This component fetches the possible values in the reference resource
 * (using `dataProvider.getList()`), then delegates rendering
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
 *     <AutocompleteInput optionText="title" />
 * </ReferenceInput>
 */
const ReferenceInput = (props: ReferenceInputProps) => {
    const {
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        validate,
        ...rest
    } = props;
    const inputProps = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        validate,
        ...rest,
    });
    return (
        <ReferenceInputView
            {...inputProps}
            {...rest}
            {...useReferenceInputController({ ...rest, ...inputProps })}
        />
    );
};

ReferenceInput.propTypes = {
    allowEmpty: PropTypes.bool,
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
    filter: {},
    filterToQuery: searchText => (searchText ? { q: searchText } : {}),
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
};

export interface ReferenceInputProps extends InputProps {
    allowEmpty?: boolean;
    basePath?: string;
    children: ReactElement;
    classes?: any;
    className?: string;
    filterToQuery?: (filter: string) => any;
    label?: string;
    perPage?: number;
    reference: string;
    // @deprecated
    referenceSource?: (resource: string, source: string) => string;
    resource?: string;
    enableGetChoices?: (filters: any) => boolean;
    [key: string]: any;
}

const sanitizeRestProps = ({
    dataStatus = null,
    enableGetChoices = null,
    filter = null,
    filterToQuery = null,
    onChange = null,
    perPage = null,
    reference = null,
    referenceRecord = null,
    referenceSource = null,
    sort = null,
    validation = null,
    ...rest
}) => sanitizeInputRestProps(rest);

export interface ReferenceInputViewProps
    extends ReferenceInputValue,
        ReferenceInputProps,
        Omit<UseInputValue, 'id'> {}

export const ReferenceInputView = (props: ReferenceInputViewProps) => {
    const {
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
        label,
        meta,
        possibleValues,
        resource,
        reference,
        setFilter,
        setPagination,
        setSort,
        source,
        warning,
        ...rest
    } = props;
    if (Children.count(children) !== 1) {
        throw new Error('<ReferenceInput> only accepts a single child');
    }

    // This is not a final-form error but an unrecoverable error from the
    // useReferenceInputController hook
    if (error) {
        return <ReferenceError label={label} error={error} />;
    }

    // When the useReferenceInputController returns a warning, it means it
    // had an issue trying to load the referenced record
    // We display it by overriding the final-form meta
    const finalMeta = warning
        ? {
              ...meta,
              error: warning,
          }
        : meta;

    // helperText should never be set on ReferenceInput, only in child component
    // But in a Filter component, the child helperText have to be forced to false
    warningLog(
        helperText !== undefined && helperText !== false,
        "<ReferenceInput> doesn't accept a helperText prop. Set the helperText prop on the child component instead"
    );

    const disabledHelperText = helperText === false ? { helperText } : {};

    return (
        <ResourceContextProvider value={reference}>
            <ListContextProvider value={possibleValues}>
                {cloneElement(children, {
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
                    ...disabledHelperText,
                    ...sanitizeRestProps(rest),
                })}
            </ListContextProvider>
        </ResourceContextProvider>
    );
};

export default ReferenceInput;
