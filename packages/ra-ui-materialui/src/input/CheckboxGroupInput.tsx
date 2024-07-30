import * as React from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useCallback, FunctionComponent } from 'react';
import get from 'lodash/get';
import FormLabel from '@mui/material/FormLabel';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import { CheckboxProps } from '@mui/material/Checkbox';
import {
    FieldTitle,
    useInput,
    ChoicesProps,
    useChoicesContext,
    useGetRecordRepresentation,
} from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { CheckboxGroupInputItem } from './CheckboxGroupInputItem';
import { InputHelperText } from './InputHelperText';
import { Labeled } from '../Labeled';
import { LinearProgress } from '../layout';

/**
 * An Input component for a checkbox group, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * The expected input must be an array of identifiers (e.g. [12, 31]) which correspond to
 * the 'optionValue' of 'choices' attribute objects.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property as the option text
 * @example
 * const choices = [
 *     { id: 12, name: 'Ray Hakt' },
 *     { id: 31, name: 'Ann Gullar' },
 *     { id: 42, name: 'Sean Phonee' },
 * ];
 * <CheckboxGroupInput source="recipients" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi' },
 *    { _id: 456, full_name: 'Jane Austen' },
 * ];
 * <CheckboxGroupInput source="recipients" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that can access
 * the related choice through the `useRecordContext` hook. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = () => {
 *     const record = useRecordContext();
 *     return <span>{record.first_name} {record.last_name}</span>;
 * };
 *
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={<FullNameField />}/>
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'programming', name: 'myroot.category.programming' },
 *    { id: 'lifestyle', name: 'myroot.category.lifestyle' },
 *    { id: 'photography', name: 'myroot.category.photography' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceArrayInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <CheckboxGroupInput source="tags" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the Material UI <Checkbox> components
 */
export const CheckboxGroupInput: FunctionComponent<
    CheckboxGroupInputProps
> = props => {
    const {
        choices: choicesProp,
        className,
        classes: classesOverride,
        format,
        helperText,
        label,
        labelPlacement,
        isLoading: isLoadingProp,
        isPending: isPendingProp,
        isFetching: isFetchingProp,
        margin = 'dense',
        onBlur,
        onChange,
        options,
        optionText,
        optionValue = 'id',
        parse,
        resource: resourceProp,
        row = true,
        source: sourceProp,
        translateChoice,
        validate,
        disabled,
        readOnly,
        ...rest
    } = props;

    const {
        allChoices,
        isPending,
        error: fetchError,
        resource,
        source,
        isFromReference,
    } = useChoicesContext({
        choices: choicesProp,
        isFetching: isFetchingProp,
        isLoading: isLoadingProp,
        isPending: isPendingProp,
        resource: resourceProp,
        source: sourceProp,
    });

    if (source === undefined) {
        throw new Error(
            `If you're not wrapping the CheckboxGroupInput inside a ReferenceArrayInput, you must provide the source prop`
        );
    }

    if (!isPending && !fetchError && allChoices === undefined) {
        throw new Error(
            `If you're not wrapping the CheckboxGroupInput inside a ReferenceArrayInput, you must provide the choices prop`
        );
    }

    const {
        field: { onChange: formOnChange, onBlur: formOnBlur, value, ref },
        fieldState: { error, invalid },
        id,
        isRequired,
    } = useInput({
        format,
        parse,
        resource,
        source,
        validate,
        onChange,
        onBlur,
        disabled,
        readOnly,
        ...rest,
    });

    const getRecordRepresentation = useGetRecordRepresentation(resource);

    const handleCheck = useCallback(
        (event, isChecked) => {
            let newValue;

            if (
                allChoices &&
                allChoices.every(
                    item => typeof get(item, optionValue) === 'number'
                )
            ) {
                try {
                    // try to convert string value to number, e.g. '123'
                    newValue = JSON.parse(event.target.value);
                } catch (e) {
                    // impossible to convert value, e.g. 'abc'
                    newValue = event.target.value;
                }
            } else {
                newValue = event.target.value;
            }

            if (isChecked) {
                formOnChange([...(value || []), ...[newValue]]);
            } else {
                formOnChange(value.filter(v => v != newValue)); // eslint-disable-line eqeqeq
            }
            formOnBlur(); // Ensure field is flagged as touched
        },
        [allChoices, formOnChange, formOnBlur, optionValue, value]
    );

    if (isPending) {
        return (
            <Labeled
                id={id}
                label={label}
                source={source}
                resource={resource}
                className={clsx('ra-input', `ra-input-${source}`, className)}
                isRequired={isRequired}
                {...rest}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    const renderHelperText = !!fetchError || helperText !== false || invalid;

    return (
        <StyledFormControl
            component="fieldset"
            margin={margin}
            error={fetchError || invalid}
            className={clsx('ra-input', `ra-input-${source}`, className)}
            {...sanitizeRestProps(rest)}
        >
            <FormLabel
                component="legend"
                className={CheckboxGroupInputClasses.label}
            >
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </FormLabel>
            <FormGroup row={row}>
                {allChoices?.map((choice, index) => (
                    <CheckboxGroupInputItem
                        key={get(choice, optionValue)}
                        choice={choice}
                        id={id}
                        onChange={handleCheck}
                        options={options}
                        optionText={
                            optionText ??
                            (isFromReference ? getRecordRepresentation : 'name')
                        }
                        optionValue={optionValue}
                        translateChoice={translateChoice ?? !isFromReference}
                        value={value}
                        labelPlacement={labelPlacement}
                        inputRef={index === 0 ? ref : undefined}
                        disabled={disabled || readOnly}
                        readOnly={readOnly}
                        {...sanitizeRestProps(rest)}
                    />
                ))}
            </FormGroup>
            {renderHelperText ? (
                <FormHelperText
                    error={!!fetchError || !!error}
                    className={CheckboxGroupInputClasses.helperText}
                >
                    <InputHelperText
                        error={error?.message || fetchError?.message}
                        helperText={helperText}
                    />
                </FormHelperText>
            ) : null}
        </StyledFormControl>
    );
};

const sanitizeRestProps = ({
    refetch,
    setFilter,
    setPagination,
    setSort,
    loaded,
    touched,
    ...rest
}: any) => sanitizeInputRestProps(rest);

export type CheckboxGroupInputProps = Omit<CommonInputProps, 'source'> &
    ChoicesProps &
    CheckboxProps &
    FormControlProps & {
        options?: CheckboxProps;
        row?: boolean;
        // Optional as this input can be used inside a ReferenceInput
        source?: string;
        labelPlacement?: 'bottom' | 'end' | 'start' | 'top';
    };

const PREFIX = 'RaCheckboxGroupInput';

export const CheckboxGroupInputClasses = {
    label: `${PREFIX}-label`,
    helperText: `${PREFIX}-helperText`,
};

const StyledFormControl = styled(FormControl, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${CheckboxGroupInputClasses.label}`]: {
        transform: 'translate(0, 4px) scale(0.75)',
        transformOrigin: `top ${theme.direction === 'ltr' ? 'left' : 'right'}`,
    },
    [`& .${CheckboxGroupInputClasses.helperText}`]: {
        marginLeft: 0,
        marginRight: 0,
    },
}));
