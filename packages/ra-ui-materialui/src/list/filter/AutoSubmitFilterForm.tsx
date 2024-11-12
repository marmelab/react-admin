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
        mode: 'onChange', // TODO - check if we need this
        // TODO - check reactiveness to external changes
        values: filterValues,
        resolver: finalResolver,
        ...rest,
    });
    const { handleSubmit, watch, formState } = form;
    const { isValid } = formState;

    const onSubmit = useEvent((values: any): void => {
        // Avoid calling setFilters with the same values (can happen if the form
        // is reset with the updated filterValues)
        if (
            isEqual(filterValues, {
                ...filterValues,
                ...values,
            })
        ) {
            return;
        }
        console.log('calling setFilters with', {
            ...filterValues,
            ...values,
        });
        // TODO - check how to remove a filter
        setFilters({
            ...filterValues,
            ...values,
        });
    });
    const debouncedOnSubmit = useDebouncedEvent(onSubmit, debounce || 0);

    useEffect(() => {
        const { unsubscribe } = watch(values => {
            // Do not submit the form if it is invalid
            if (!isValid) {
                return;
            }
            // Submit the form on values change
            debouncedOnSubmit(values);
        });
        return () => unsubscribe();
    }, [handleSubmit, watch, debouncedOnSubmit, isValid]);

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
    validate?: ValidateForm; // TODO test
    debounce?: number | false; // TODO test
    resource?: string;
}
