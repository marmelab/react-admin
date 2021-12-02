import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    Select,
    MenuItem,
    InputLabel,
    FormHelperText,
    FormControl,
    Chip,
} from '@mui/material';
import classnames from 'classnames';
import {
    FieldTitle,
    useInput,
    InputProps,
    ChoicesProps,
    useChoices,
} from 'ra-core';
import { InputHelperText } from './InputHelperText';
import { SelectProps } from '@mui/material/Select';
import { FormControlProps } from '@mui/material/FormControl';
import { Labeled } from './Labeled';
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
export const SelectArrayInput = (props: SelectArrayInputProps) => {
    const {
        choices = [],
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

    const inputLabel = useRef(null);

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
        event => {
            if (event?.target?.value === undefined) {
                input.onChange([...input.value, getChoiceValue(event)]);
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
        optionText,
    });

    const createItem = create || onCreate ? getCreateItem() : null;
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
                    {!!createItem && choice?.id === createItem.id
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
            <StyledFormControl
                margin={margin}
                className={classnames(SelectArrayInputClasses.root, className)}
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
                        <div className={SelectArrayInputClasses.chips}>
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
                                        className={SelectArrayInputClasses.chip}
                                    />
                                ))}
                        </div>
                    )}
                    data-testid="selectArray"
                    {...input}
                    onChange={handleChangeWithCreateSupport}
                    value={input.value || []}
                    {...options}
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
            </StyledFormControl>
            {createElement}
        </>
    );
};

export interface SelectArrayInputProps
    extends Omit<ChoicesProps, 'choices' | 'optionText'>,
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

const PREFIX = 'RaSelectArrayInput';

export const SelectArrayInputClasses = {
    root: `${PREFIX}-root`,
    chips: `${PREFIX}-chips`,
    chip: `${PREFIX}-chip`,
};

const StyledFormControl = styled(FormControl, { name: PREFIX })(
    ({ theme }) => ({
        [`&.${SelectArrayInputClasses.root}`]: {},

        [`& .${SelectArrayInputClasses.chips}`]: {
            display: 'flex',
            flexWrap: 'wrap',
        },

        [`& .${SelectArrayInputClasses.chip}`]: {
            margin: theme.spacing(1 / 4),
        },
    })
);
