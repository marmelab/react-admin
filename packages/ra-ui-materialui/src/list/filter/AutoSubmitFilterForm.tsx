import {
    getSimpleValidationResolver,
    SourceContextProvider,
    SourceContextValue,
    useEvent,
    useListFilterContext,
    useResourceContext,
    ValidateForm,
    useDebouncedEvent,
} from 'ra-core';
import * as React from 'react';
import { ReactNode, useEffect } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import isEqual from 'lodash/isEqual';

// TODO - check if this can be moved to ra-core

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
        // TODO - figure out a way to react to external changes in filter values
        defaultValues: filterValues,
        resolver: finalResolver,
        ...rest,
    });
    const { handleSubmit, watch, formState } = form;
    const { isValid } = formState;

    const onSubmit = useEvent((values: any): void => {
        // Do not call setFilters if the form is invalid
        if (!isValid) {
            return;
        }
        // Avoid calling setFilters with the same values (happens when the form
        // is reset with the updated filterValues)
        // TODO - check if still needed since I use defaultValues
        if (
            isEqual(filterValues, {
                ...filterValues,
                ...values,
            })
        ) {
            return;
        }
        console.log('calling setFilters with', {
            // filterValues,
            // values,
            // result: {
            //     ...filterValues,
            //     ...values,
            // },
            ...filterValues,
            ...values,
        });
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
            <SourceContextProvider value={sourceContext}>
                <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
            </SourceContextProvider>
        </FormProvider>
    );
};

export interface AutoSubmitFilterFormProps
    extends Omit<UseFormProps, 'onSubmit'> {
    children: ReactNode;
    validate?: ValidateForm;
    debounce?: number | false;
    resource?: string;
}
