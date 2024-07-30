import * as React from 'react';
import { ReactElement, useEffect } from 'react';
import clsx from 'clsx';
import {
    isRequired,
    FieldTitle,
    composeSyncValidators,
    useApplyInputDefaultValues,
    useGetValidationErrorMessage,
    useFormGroupContext,
    useFormGroups,
    SourceContextProvider,
    SourceContextValue,
    useSourceContext,
    OptionalResourceContextProvider,
} from 'ra-core';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
    InputLabel,
    FormControl,
    FormHelperText,
    FormControlProps,
    styled,
} from '@mui/material';

import { LinearProgress } from '../../layout';
import { CommonInputProps } from '../CommonInputProps';
import { InputHelperText } from '../InputHelperText';
import { sanitizeInputRestProps } from '../sanitizeInputRestProps';
import { Labeled } from '../../Labeled';
import { ArrayInputContext } from './ArrayInputContext';

/**
 * To edit arrays of data embedded inside a record, <ArrayInput> creates a list of sub-forms.
 *
 *  @example
 *
 *      import { ArrayInput, SimpleFormIterator, DateInput, TextInput } from 'react-admin';
 *
 *      <ArrayInput source="backlinks">
 *          <SimpleFormIterator>
 *              <DateInput source="date" />
 *              <TextInput source="url" />
 *          </SimpleFormIterator>
 *      </ArrayInput>
 *
 * <ArrayInput> allows the edition of embedded arrays, like the backlinks field
 * in the following post record:
 *
 * {
 *   id: 123
 *   backlinks: [
 *         {
 *             date: '2012-08-10T00:00:00.000Z',
 *             url: 'http://example.com/foo/bar.html',
 *         },
 *         {
 *             date: '2012-08-14T00:00:00.000Z',
 *             url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
 *         }
 *    ]
 * }
 *
 * <ArrayInput> expects a single child, which must be a *form iterator* component.
 * A form iterator is a component accepting a fields object as passed by
 * react-hook-form-arrays's useFieldArray() hook, and defining a layout for
 * an array of fields. For instance, the <SimpleFormIterator> component
 * displays an array of fields in an unordered list (<ul>), one sub-form by
 * list item (<li>). It also provides controls for adding and removing
 * a sub-record (a backlink in this example).
 *
 * @see {@link https://react-hook-form.com/docs/usefieldarray}
 */
export const ArrayInput = (props: ArrayInputProps) => {
    const {
        className,
        defaultValue,
        label,
        isFetching,
        isLoading,
        isPending,
        children,
        helperText,
        resource: resourceFromProps,
        source: arraySource,
        validate,
        variant,
        disabled,
        readOnly,
        margin = 'dense',
        ...rest
    } = props;

    const formGroupName = useFormGroupContext();
    const formGroups = useFormGroups();
    const parentSourceContext = useSourceContext();
    const finalSource = parentSourceContext.getSource(arraySource);

    const sanitizedValidate = Array.isArray(validate)
        ? composeSyncValidators(validate)
        : validate;
    const getValidationErrorMessage = useGetValidationErrorMessage();

    const { getFieldState, formState, getValues, register, unregister } =
        useFormContext();

    const fieldProps = useFieldArray({
        name: finalSource,
        rules: {
            validate: async value => {
                if (!sanitizedValidate) return true;
                const error = await sanitizedValidate(
                    value,
                    getValues(),
                    props
                );

                if (!error) return true;
                return getValidationErrorMessage(error);
            },
        },
    });

    // We need to register the array itself as a field to enable validation at its level
    useEffect(() => {
        register(finalSource);
        formGroups &&
            formGroupName != null &&
            formGroups.registerField(finalSource, formGroupName);

        return () => {
            unregister(finalSource, {
                keepValue: true,
                keepError: true,
                keepDirty: true,
                keepTouched: true,
            });
            formGroups &&
                formGroupName != null &&
                formGroups.unregisterField(finalSource, formGroupName);
        };
    }, [register, unregister, finalSource, formGroups, formGroupName]);

    useApplyInputDefaultValues({
        inputProps: props,
        isArrayInput: true,
        fieldArrayInputControl: fieldProps,
    });

    const { error } = getFieldState(finalSource, formState);

    // The SourceContext will be read by children of ArrayInput to compute their composed source and label
    //
    // <ArrayInput source="orders" /> => SourceContext is "orders"
    //   <SimpleFormIterator> => SourceContext is "orders.0"
    //     <DateInput source="date" /> => final source for this input will be "orders.0.date"
    //   </SimpleFormIterator>
    // </ArrayInput>
    //
    const sourceContext = React.useMemo<SourceContextValue>(
        () => ({
            // source is the source of the ArrayInput child
            getSource: (source: string) => {
                if (!source) {
                    // SimpleFormIterator calls getSource('') to get the arraySource
                    return parentSourceContext.getSource(arraySource);
                }

                // We want to support nesting and composition with other inputs (e.g. TranslatableInputs, ReferenceOneInput, etc),
                // we must also take into account the parent SourceContext
                //
                // <ArrayInput source="orders" /> => SourceContext is "orders"
                //   <SimpleFormIterator> => SourceContext is "orders.0"
                //      <DateInput source="date" /> => final source for this input will be "orders.0.date"
                //      <ArrayInput source="items" /> => SourceContext is "orders.0.items"
                //          <SimpleFormIterator> => SourceContext is "orders.0.items.0"
                //              <TextInput source="reference" /> => final source for this input will be "orders.0.items.0.reference"
                //          </SimpleFormIterator>
                //      </ArrayInput>
                //   </SimpleFormIterator>
                // </ArrayInput>
                return parentSourceContext.getSource(
                    `${arraySource}.${source}`
                );
            },
            // if Array source is items, and child source is name, .0.name => resources.orders.fields.items.name
            getLabel: (source: string) =>
                parentSourceContext.getLabel(`${arraySource}.${source}`),
        }),
        [parentSourceContext, arraySource]
    );

    if (isPending) {
        return (
            <Labeled label={label} className={className}>
                <LinearProgress />
            </Labeled>
        );
    }
    const renderHelperText = helperText !== false || !!error;

    return (
        <Root
            fullWidth
            margin={margin}
            className={clsx(
                'ra-input',
                `ra-input-${finalSource}`,
                ArrayInputClasses.root,
                className
            )}
            error={!!error}
            {...sanitizeInputRestProps(rest)}
        >
            <InputLabel
                component="span"
                className={ArrayInputClasses.label}
                shrink
                error={!!error}
            >
                <FieldTitle
                    label={label}
                    source={arraySource}
                    resource={resourceFromProps}
                    isRequired={isRequired(validate)}
                />
            </InputLabel>
            <ArrayInputContext.Provider value={fieldProps}>
                <OptionalResourceContextProvider value={resourceFromProps}>
                    <SourceContextProvider value={sourceContext}>
                        {children}
                    </SourceContextProvider>
                </OptionalResourceContextProvider>
            </ArrayInputContext.Provider>
            {renderHelperText ? (
                <FormHelperText error={!!error}>
                    <InputHelperText
                        // root property is applicable to built-in validation only,
                        // Resolvers are yet to support useFieldArray root level validation.
                        // Reference: https://react-hook-form.com/docs/usefieldarray
                        error={error?.root?.message ?? error?.message}
                        helperText={helperText}
                    />
                </FormHelperText>
            ) : null}
        </Root>
    );
};

export const getArrayInputError = error => {
    if (Array.isArray(error)) {
        return undefined;
    }
    return error;
};

export interface ArrayInputProps
    extends CommonInputProps,
        Omit<FormControlProps, 'defaultValue' | 'onBlur' | 'onChange'> {
    className?: string;
    children: ReactElement;
    disabled?: boolean;
    isFetching?: boolean;
    isLoading?: boolean;
    isPending?: boolean;
}

const PREFIX = 'RaArrayInput';

export const ArrayInputClasses = {
    root: `${PREFIX}-root`,
    label: `${PREFIX}-label`,
};

const Root = styled(FormControl, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    marginTop: 0,
    [`& .${ArrayInputClasses.label}`]: {
        position: 'relative',
        top: theme.spacing(0.5),
        left: theme.spacing(-1.5),
    },
    [`& .${ArrayInputClasses.root}`]: {
        // nested ArrayInput
        paddingLeft: theme.spacing(2),
    },
}));
