import { useEffect, useRef } from 'react';
import { useFormState, UseFormStateParams } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import { useTranslate } from '../i18n';

/**
 * Display a confirmation dialog if the form has unsaved changes.
 * - If the user confirms, the navigation continues and the changes are lost.
 * - If the user cancels, the navigation is cancelled and the changes are kept.
 */
const useWarnWhenUnsavedChanges = (
    enable: boolean,
    formRootPathname?: string
) => {
    const history = useHistory();
    const translate = useTranslate();
    const { pristine, submitSucceeded, submitting } = useFormState(
        UseFormStateSubscription
    );
    const initialLocation = useRef(
        formRootPathname || history.location.pathname
    );

    useEffect(() => {
        if (!enable) {
            return;
        }

        const release = history.block(location => {
            const isInsideForm = location.pathname.startsWith(
                initialLocation.current
            );

            if (!pristine && !isInsideForm && !submitSucceeded && !submitting) {
                return translate('ra.message.unsaved_changes');
            }

            return undefined;
        });

        return () => {
            if (release) {
                release();
            }
        };
    }, [pristine, enable, history, translate, submitSucceeded, submitting]);
};

const UseFormStateSubscription: UseFormStateParams = {
    // For some reason, subscribing only to pristine does not rerender when a field become dirty
    // because it has a defaultValue (not initialValue as setting an initialValue does not make the field dirty)
    subscription: {
        pristine: true,
        dirtyFields: true,
        submitSucceeded: true,
        submitting: true,
    },
};

export default useWarnWhenUnsavedChanges;
