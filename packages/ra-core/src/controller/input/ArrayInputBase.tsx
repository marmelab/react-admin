import * as React from 'react';
import { type ReactNode, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { InputProps } from '../../form/useInput';
import { composeSyncValidators } from '../../form/validation/validate';
import { useGetValidationErrorMessage } from '../../form/validation/useGetValidationErrorMessage';
import { useApplyInputDefaultValues } from '../../form/useApplyInputDefaultValues';
import { useFormGroupContext } from '../../form/groups/useFormGroupContext';
import { useFormGroups } from '../../form/groups/useFormGroups';
import {
    OptionalResourceContextProvider,
    SourceContextProvider,
    type SourceContextValue,
    useSourceContext,
} from '../../core';
import { ArrayInputContext } from './ArrayInputContext';

/**
 * To edit arrays of data embedded inside a record, <ArrayInputBase> creates a list of sub-forms.
 *
 *  @example
 *
 *      import { ArrayInputBase } from 'ra-core';
 *      import { SimpleFormIterator, DateInput, TextInput } from 'my-react-admin-ui';
 *
 *      <ArrayInputBase source="backlinks">
 *          <SimpleFormIterator>
 *              <DateInput source="date" />
 *              <TextInput source="url" />
 *          </SimpleFormIterator>
 *      </ArrayInputBase>
 *
 * <ArrayInputBase> allows the edition of embedded arrays, like the backlinks field
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
 * <ArrayInputBase> expects a single child, which must be a *form iterator* component.
 * A form iterator is a component accepting a fields object as passed by
 * react-hook-form-arrays's useFieldArray() hook, and defining a layout for
 * an array of fields.
 *
 * @see {@link https://react-hook-form.com/docs/usefieldarray}
 */
export const ArrayInputBase = (props: ArrayInputBaseProps) => {
    const {
        children,
        defaultValue = [],
        resource: resourceFromProps,
        source: arraySource,
        validate,
    } = props;

    const formGroupName = useFormGroupContext();
    const formGroups = useFormGroups();
    const parentSourceContext = useSourceContext();
    const finalSource = parentSourceContext.getSource(arraySource);

    const sanitizedValidate = Array.isArray(validate)
        ? composeSyncValidators(validate)
        : validate;
    const getValidationErrorMessage = useGetValidationErrorMessage();

    const { getValues } = useFormContext();

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

    useEffect(() => {
        if (formGroups && formGroupName != null) {
            formGroups.registerField(finalSource, formGroupName);
        }

        return () => {
            if (formGroups && formGroupName != null) {
                formGroups.unregisterField(finalSource, formGroupName);
            }
        };
    }, [finalSource, formGroups, formGroupName]);

    useApplyInputDefaultValues({
        inputProps: { ...props, defaultValue },
        isArrayInput: true,
        fieldArrayInputControl: fieldProps,
    });

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

    return (
        <ArrayInputContext.Provider value={fieldProps}>
            <OptionalResourceContextProvider value={resourceFromProps}>
                <SourceContextProvider value={sourceContext}>
                    {children}
                </SourceContextProvider>
            </OptionalResourceContextProvider>
        </ArrayInputContext.Provider>
    );
};

export const getArrayInputError = error => {
    if (Array.isArray(error)) {
        return undefined;
    }
    return error;
};

export interface ArrayInputBaseProps
    extends Omit<InputProps, 'disabled' | 'readOnly'> {
    children: ReactNode;
}
