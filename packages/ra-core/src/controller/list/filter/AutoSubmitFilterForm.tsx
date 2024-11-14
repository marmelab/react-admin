import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import * as React from 'react';
import { ReactNode, useEffect } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import {
    SourceContextProvider,
    SourceContextValue,
    useResourceContext,
} from '../../../core';
import {
    FormGroupsProvider,
    getSimpleValidationResolver,
    ValidateForm,
} from '../../../form';
import { useDebouncedEvent, useEvent } from '../../../util';
import { useListFilterContext } from '../useListFilterContext';

/**
 * TODO
 */
export const AutoSubmitFilterForm = (props: AutoSubmitFilterFormProps) => {
    const { filterValues, setFilters } = useListFilterContext();
    const resource = useResourceContext(props);

    const { debounce = 500, resolver, validate, children, ...rest } = props;

    const finalResolver = resolver
        ? resolver
        : validate
          ? getSimpleValidationResolver(validate)
          : undefined;

    const form = useForm({
        mode: 'onChange',
        defaultValues: filterValues,
        resolver: finalResolver,
        ...rest,
    });
    const { handleSubmit, getValues, reset, watch, formState } = form;
    const { isValid } = formState;

    // Ref tracking if there are internal changes pending, i.e. changes that
    // should not trigger a reset
    const formChangesPending = React.useRef(false);

    // Reapply filterValues when they change externally
    useEffect(() => {
        const newValues = getFilterFormValues(getValues(), filterValues);
        const previousValues = getValues();
        console.log('FilterForm useEffect', {
            formChangesPending: formChangesPending.current,
            newValues,
            previousValues,
            filterValues,
        });
        if (formChangesPending.current) {
            // The effect was triggered by a form change (i.e. internal change),
            // so we don't need to reset the form
            formChangesPending.current = false;
            return;
        }
        if (!isEqual(newValues, previousValues)) {
            console.log('FilterForm called reset !', {
                newValues,
            });
            reset(newValues);
        }
        // The reference to the filterValues object is not updated when it changes,
        // so we must stringify it to compare it by value.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filterValues), getValues, reset]);

    const onSubmit = useEvent((values: any): void => {
        // Do not call setFilters if the form is invalid
        if (!isValid) {
            return;
        }
        console.log('calling setFilters with', {
            ...filterValues,
            ...values,
        });
        formChangesPending.current = true;
        setFilters({
            ...filterValues,
            ...values,
        });
    });
    const debouncedOnSubmit = useDebouncedEvent(onSubmit, debounce || 0);

    // Submit the form on values change
    useEffect(() => {
        const { unsubscribe } = watch(values => {
            debouncedOnSubmit(values);
        });
        return () => unsubscribe();
    }, [watch, debouncedOnSubmit]);

    const sourceContext = React.useMemo<SourceContextValue>(
        () => ({
            getSource: (source: string) => source,
            getLabel: (source: string) =>
                `resources.${resource}.fields.${source}`,
        }),
        [resource]
    );

    return (
        <FormProvider {...form}>
            <FormGroupsProvider>
                <SourceContextProvider value={sourceContext}>
                    <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
                </SourceContextProvider>
            </FormGroupsProvider>
        </FormProvider>
    );
};

export interface AutoSubmitFilterFormProps
    extends Omit<UseFormProps, 'onSubmit' | 'defaultValues'> {
    children: ReactNode;
    validate?: ValidateForm;
    debounce?: number | false;
    resource?: string;
}

/**
 * Because we are using controlled inputs with react-hook-form, we must provide a default value
 * for each input when resetting the form. (see https://react-hook-form.com/docs/useform/reset).
 * To ensure we don't provide undefined which will result to the current input value being reapplied
 * and due to the dynamic nature of the filter form, we rebuild the filter form values from its current
 * values and make sure to pass at least an empty string for each input.
 */
const getFilterFormValues = (
    formValues: Record<string, any>,
    filterValues: Record<string, any>
) => {
    return Object.keys(formValues).reduce(
        (acc, key) => {
            acc[key] = getInputValue(formValues, key, filterValues);
            return acc;
        },
        cloneDeep(filterValues) ?? {}
    );
};

const getInputValue = (
    formValues: Record<string, any>,
    key: string,
    filterValues: Record<string, any>
) => {
    if (formValues[key] === undefined || formValues[key] === null) {
        return get(filterValues, key, '');
    }
    if (Array.isArray(formValues[key])) {
        return get(filterValues, key, '');
    }
    if (formValues[key] instanceof Date) {
        return get(filterValues, key, '');
    }
    if (typeof formValues[key] === 'object') {
        const inputValues = Object.keys(formValues[key]).reduce(
            (acc, innerKey) => {
                const nestedInputValue = getInputValue(
                    formValues[key],
                    innerKey,
                    (filterValues || {})[key] ?? {}
                );
                acc[innerKey] = nestedInputValue;
                return acc;
            },
            {}
        );
        if (!Object.keys(inputValues).length) return '';
        return inputValues;
    }
    return get(filterValues, key, '');
};
