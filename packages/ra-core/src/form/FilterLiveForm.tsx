import * as React from 'react';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import { ReactNode, useEffect } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import {
    SourceContextProvider,
    SourceContextValue,
    useResourceContext,
} from '../core';
import {
    FormGroupsProvider,
    getSimpleValidationResolver,
    ValidateForm,
} from '.';
import { useDebouncedEvent } from '../util';
import { useListContext } from '../controller/list/useListContext';

/**
 * This component offers a convenient way to create a form that automatically
 * updates the filters when the user changes its child input values.
 *
 * It fits nicely alongside a `<FilterList>` component, but you can also use it
 * at other places to create your own filter UI.
 *
 * @example
 * import MailIcon from '@mui/icons-material/MailOutline';
 * import TitleIcon from '@mui/icons-material/Title';
 * import { Card, CardContent } from '@mui/material';
 * import * as React from 'react';
 * import {
 *     FilterLiveForm,
 *     FilterList,
 *     FilterListItem,
 *     FilterListSection,
 *     TextInput,
 * } from 'react-admin';
 *
 * export const BookListAside = () => (
 *     <Card sx={{ order: -1, mr: 2, mt: 6, width: 250, height: 'fit-content' }}>
 *         <CardContent>
 *             <FilterList label="Subscribed to newsletter" icon={<MailIcon />}>
 *                 <FilterListItem label="Yes" value={{ has_newsletter: true }} />
 *                 <FilterListItem label="No" value={{ has_newsletter: false }} />
 *             </FilterList>
 *             <FilterListSection label="Title" icon={<TitleIcon />}>
 *                 <FilterLiveForm>
 *                     <TextInput source="title" resettable helperText={false} />
 *                 </FilterLiveForm>
 *             </FilterListSection>
 *         </CardContent>
 *     </Card>
 * );
 */
export const FilterLiveForm = (props: FilterLiveFormProps) => {
    const { filterValues, setFilters } = useListContext();
    const resource = useResourceContext(props);

    const {
        debounce = 500,
        resolver,
        validate,
        children,
        formComponent: Component = HTMLForm,
        ...rest
    } = props;

    const finalResolver = resolver
        ? resolver
        : validate
          ? getSimpleValidationResolver(validate)
          : undefined;

    const formContext = useForm({
        mode: 'onChange',
        defaultValues: filterValues,
        resolver: finalResolver,
        ...rest,
    });
    const { handleSubmit, getValues, reset, watch, formState } = formContext;
    const { isValid } = formState;

    // Ref tracking if there are internal changes pending, i.e. changes that
    // should not trigger a reset
    const formChangesPending = React.useRef(false);

    // Reapply filterValues when they change externally
    useEffect(() => {
        const newValues = getFilterFormValues(getValues(), filterValues);
        const previousValues = getValues();
        if (formChangesPending.current) {
            // The effect was triggered by a form change (i.e. internal change),
            // so we don't need to reset the form
            formChangesPending.current = false;
            return;
        }
        if (!isEqual(newValues, previousValues)) {
            reset(newValues);
        }
        // The reference to the filterValues object is not updated when it changes,
        // so we must stringify it to compare it by value.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filterValues), getValues, reset]);

    const onSubmit = (values: any): void => {
        // Do not call setFilters if the form is invalid
        if (!isValid) {
            return;
        }
        formChangesPending.current = true;
        setFilters({
            ...filterValues,
            ...values,
        });
    };
    const debouncedOnSubmit = useDebouncedEvent(onSubmit, debounce || 0);

    // Submit the form on values change
    useEffect(() => {
        const { unsubscribe } = watch((values, { name }) => {
            // Check that the name is present to avoid setting filters when
            // watch was triggered by a reset
            if (name) {
                if (get(values, name) === '') {
                    const newValues = cloneDeep(values);
                    set(newValues, name, '');
                    debouncedOnSubmit(newValues);
                } else {
                    debouncedOnSubmit(values);
                }
            }
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
        <FormProvider {...formContext}>
            <FormGroupsProvider>
                <SourceContextProvider value={sourceContext}>
                    <Component onSubmit={handleSubmit(onSubmit)}>
                        {children}
                    </Component>
                </SourceContextProvider>
            </FormGroupsProvider>
        </FormProvider>
    );
};

const HTMLForm = (props: React.HTMLAttributes<HTMLFormElement>) => (
    <form {...props} />
);

export interface FilterLiveFormProps
    extends Omit<UseFormProps, 'onSubmit' | 'defaultValues'> {
    children: ReactNode;
    validate?: ValidateForm;
    debounce?: number | false;
    resource?: string;
    formComponent?: React.ComponentType<
        Pick<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'>
    >;
}

/**
 * Because we are using controlled inputs with react-hook-form, we must provide a default value
 * for each input when resetting the form. (see https://react-hook-form.com/docs/useform/reset).
 * To ensure we don't provide undefined which will result to the current input value being reapplied
 * and due to the dynamic nature of the filter form, we rebuild the filter form values from its current
 * values and make sure to pass at least an empty string for each input.
 */
export const getFilterFormValues = (
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
