import * as React from 'react';
import { BaseSyntheticEvent, useEffect } from 'react';

import { useNotify } from '../notification';
import { FormGroupsProvider } from './FormGroupsProvider';
import { useInitializeFormWithRecord } from './useInitializeFormWithRecord';
import { useIsFormInvalid } from './useIsFormInvalid';
import { useWarnWhenUnsavedChanges } from './useWarnWhenUnsavedChanges';
import { FormOwnProps, FormRenderProps } from './Form';

export const FormContent = (props: FormContentProps) => {
    const {
        defaultValues,
        formRootPathname,
        handleSubmit: formHandleSubmit,
        record,
        render,
        warnWhenUnsavedChanges,
        ...rest
    } = props;
    const isInvalid = useIsFormInvalid();
    const notify = useNotify();

    useEffect(() => {
        if (isInvalid) {
            notify('ra.message.invalid_form', { type: 'warning' });
        }
    }, [isInvalid, notify]);
    useInitializeFormWithRecord(defaultValues, record);
    useWarnWhenUnsavedChanges(warnWhenUnsavedChanges, formRootPathname);

    const handleSubmit = (event: BaseSyntheticEvent) => {
        // Prevent outer forms to receive the event
        event.stopPropagation();
        formHandleSubmit(event);
        return;
    };

    return (
        <FormGroupsProvider>
            {render({ ...rest, handleSubmit })}
        </FormGroupsProvider>
    );
};

type FormContentProps = Omit<FormOwnProps, 'onSubmit' | 'sanitizeEmptyValues'> &
    FormRenderProps & {
        warnWhenUnsavedChanges?: boolean;
    };
