import * as React from 'react';
import { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Select,
    MenuItem,
    InputLabel,
    FormHelperText,
    FormControl,
    Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
import Labeled from './Labeled';
import { LinearProgress } from '../layout';
import {
    SupportCreateSuggestionOptions,
    useSupportCreateSuggestion,
} from './useSupportCreateSuggestion';

/**
 * An Input component for a select box allowing multiple selections, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property as the option text
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
const SelectArrayInput = (props: SelectArrayInputProps) => {
    const {
        choices = [],
        classes: classesOverride,
        className,
        create,
        createLabel,
        createValue,
        disableValue,
        format,
        helperText,
        label,
        loaded,
        loading,
        margin = 'dense',
        onBlur,
        onChange,
        onCreate,
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
    } = props;

    const classes = useStyles(props);
    const inputLabel = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);

    useEffect(() => {
        // Will be null while loading and we don't need this fix in that case
        if (inputLabel.current) {
            setLabelWidth(inputLabel.current.offsetWidth);
        }
    }, []);

    const { getChoiceText, getChoiceValue, getDisableValue } = useChoices({
        optionText,
        optionValue,
        disableValue,
        translateChoice,
    });
    const {
        input,
        isRequired,
        meta: { error, submitError, touched },
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

    const handleChange = useCallback(
        (event, newItem) => {
            if (newItem) {
                input.onChange([...input.value, getChoiceValue(newItem)]);
                return;
            }
            input.onChange(event);
        },
        [input, getChoiceValue]
    );

    const {
        getCreateItem,
        handleChange: handleChangeWithCreateSupport,
        createElement,
    } = useSupportCreateSuggestion({
        create,
        createLabel,
        createValue,
        handleChange,
        onCreate,
    });

    const createItem = getCreateItem();
    const finalChoices =
        create || onCreate ? [...choices, createItem] : choices;

    const renderMenuItemOption = useCallback(choice => getChoiceText(choice), [
        getChoiceText,
    ]);

    const renderMenuItem = useCallback(
        choice => {
            return choice ? (
                <MenuItem
                    key={getChoiceValue(choice)}
                    value={getChoiceValue(choice)}
                    disabled={getDisableValue(choice)}
                >
                    {choice?.id === createItem.id
                        ? createItem.name
                        : renderMenuItemOption(choice)}
                </MenuItem>
            ) : null;
        },
        [getChoiceValue, getDisableValue, renderMenuItemOption, createItem]
    );

    if (loading) {
        return (
            <Labeled
                label={label}
                source={source}
                resource={resource}
                className={className}
                isRequired={isRequired}
                margin={margin}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    return (
        <>
            <FormControl
                margin={margin}
                className={classnames(classes.root, className)}
                error={touched && !!(error || submitError)}
                variant={variant}
                {...sanitizeRestProps(rest)}
            >
                <InputLabel
                    ref={inputLabel}
                    id={`${label}-outlined-label`}
                    error={touched && !!(error || submitError)}
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
                    labelId={`${label}-outlined-label`}
                    multiple
                    error={!!(touched && (error || submitError))}
                    renderValue={(selected: any[]) => (
                        <div className={classes.chips}>
                            {selected
                                .map(item =>
                                    choices.find(
                                        choice =>
                                            getChoiceValue(choice) === item
                                    )
                                )
                                .filter(item => !!item)
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
                    {...input}
                    onChange={handleChangeWithCreateSupport}
                    value={input.value || []}
                    {...options}
                    labelWidth={labelWidth}
                >
                    {finalChoices.map(renderMenuItem)}
                </Select>
                <FormHelperText error={touched && !!(error || submitError)}>
                    <InputHelperText
                        touched={touched}
                        error={error || submitError}
                        helperText={helperText}
                    />
                </FormHelperText>
            </FormControl>
            {createElement}
        </>
    );
};

export interface SelectArrayInputProps
    extends Omit<ChoicesProps, 'choices'>,
        Omit<SupportCreateSuggestionOptions, 'handleChange'>,
        Omit<InputProps<SelectProps>, 'source'>,
        Omit<
            FormControlProps,
            'defaultValue' | 'onBlur' | 'onChange' | 'onFocus'
        > {
    choices?: object[];
    source?: string;
}

SelectArrayInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    disableValue: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    translateChoice: PropTypes.bool,
};

SelectArrayInput.defaultProps = {
    options: {},
    optionText: 'name',
    optionValue: 'id',
    disableValue: 'disabled',
    translateChoice: true,
};

const sanitizeRestProps = ({
    addLabel,
    allowEmpty,
    alwaysOn,
    basePath,
    choices,
    classNamInputWithOptionsPropse,
    componenInputWithOptionsPropst,
    crudGetMInputWithOptionsPropsatching,
    crudGetOInputWithOptionsPropsne,
    defaultValue,
    disableValue,
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
    }),
    { name: 'RaSelectArrayInput' }
);

export default SelectArrayInput;
