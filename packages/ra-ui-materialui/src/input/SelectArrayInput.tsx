import React, { FunctionComponent, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    makeStyles,
    Select,
    MenuItem,
    InputLabel,
    Input,
    FilledInput,
    FormHelperText,
    FormControl,
    Chip,
} from '@material-ui/core';
import classnames from 'classnames';
import {
    FieldTitle,
    useInput,
    InputProps,
    ChoicesProps,
    useChoices,
} from 'ra-core';
import InputHelperText from './InputHelperText';
import { SelectProps } from '@material-ui/core/Select';
import { FormControlProps } from '@material-ui/core/FormControl';

const sanitizeRestProps = ({
    addLabel,
    allowEmpty,
    basePath,
    choices,
    classNamInputWithOptionsPropse,
    componenInputWithOptionsPropst,
    crudGetMInputWithOptionsPropsatching,
    crudGetOInputWithOptionsPropsne,
    defaultValue,
    filter,
    filterToQuery,
    formClassName,
    initializeForm,
    input,
    isRequired,
    label,
    limitChoicesToValue,
    loaded,
    locale,
    meta,
    onChange,
    options,
    optionValue,
    optionText,
    perPage,
    record,
    reference,
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
}: any) => rest;

const useStyles = makeStyles(
    theme => ({
        root: {},
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: theme.spacing(1 / 4),
        },
        select: {
            height: 'auto',
            overflow: 'auto',
        },
    }),
    { name: 'RaSelectArrayInput' }
);

/**
 * An Input component for a select box allowing multiple selections, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: 'programming', name: 'Programming' },
 *    { id: 'lifestyle', name: 'Lifestyle' },
 *    { id: 'photography', name: 'Photography' },
 * ];
 * <SelectArrayInput source="tags" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <SelectArrayInput source="authors" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <SelectArrayInput source="authors" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <SelectArrayInput source="authors" choices={choices} optionText={<FullNameField />}/>
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'programming', name: 'myroot.tags.programming' },
 *    { id: 'lifestyle', name: 'myroot.tags.lifestyle' },
 *    { id: 'photography', name: 'myroot.tags.photography' },
 * ];
 */
const SelectArrayInput: FunctionComponent<
    ChoicesProps & InputProps<SelectProps> & FormControlProps
> = ({
    choices = [],
    classes: classesOverride,
    className,
    format,
    helperText,
    label,
    margin = 'dense',
    onBlur,
    onChange,
    onFocus,
    options,
    optionText,
    optionValue,
    parse,
    resource,
    source,
    translateChoice,
    validate,
    variant = 'filled',
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    const { getChoiceText, getChoiceValue } = useChoices({
        optionText,
        optionValue,
        translateChoice,
    });

    const {
        id,
        input,
        isRequired,
        meta: { error, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        validate,
        ...rest,
    });

    const renderMenuItemOption = useCallback(choice => getChoiceText(choice), [
        getChoiceText,
    ]);

    const renderMenuItem = useCallback(
        choice => {
            return choice ? (
                <MenuItem
                    key={getChoiceValue(choice)}
                    value={getChoiceValue(choice)}
                >
                    {renderMenuItemOption(choice)}
                </MenuItem>
            ) : null;
        },
        [getChoiceValue, renderMenuItemOption]
    );

    return (
        <FormControl
            margin={margin}
            className={classnames(classes.root, className)}
            error={touched && !!error}
            variant={variant}
            {...sanitizeRestProps(rest)}
        >
            <InputLabel
                htmlFor={id}
                shrink
                variant={variant}
                error={touched && !!error}
            >
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </InputLabel>
            <Select
                autoWidth
                multiple
                input={
                    variant === 'standard' ? (
                        <Input id={id} />
                    ) : (
                        <FilledInput id={id} />
                    )
                }
                error={!!(touched && error)}
                renderValue={(selected: any[]) => (
                    <div className={classes.chips}>
                        {selected
                            .map(item =>
                                choices.find(
                                    choice => getChoiceValue(choice) === item
                                )
                            )
                            .map(item => (
                                <Chip
                                    key={getChoiceValue(item)}
                                    label={renderMenuItemOption(item)}
                                    className={classes.chip}
                                />
                            ))}
                    </div>
                )}
                data-testid="selectArray"
                variant={variant}
                {...input}
                value={input.value || []}
                {...options}
            >
                {choices.map(renderMenuItem)}
            </Select>
            <FormHelperText error={touched && !!error}>
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormControl>
    );
};

SelectArrayInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.string,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    source: PropTypes.string,
    translateChoice: PropTypes.bool,
};

SelectArrayInput.defaultProps = {
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default SelectArrayInput;
