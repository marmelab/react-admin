import { useEffect, useRef } from 'react';
import { useForm } from 'react-final-form';
import { useHistory } from 'react-router-dom';
import get from 'lodash/get';

import { useTranslate } from '../i18n';

/**
 * Display a confirmation dialog if the form has unsaved changes.
 * - If the user confirms, the navigation continues and the changes are lost.
 * - If the user cancels, the navigation is reverted and the changes are kept.
 *
 * We can't use history.block() here because forms have routes, too (for
 * instance TabbedForm), and the confirm dialog would show up when navigating
 * inside the form. So instead of relying on route change detection, we rely
 * on unmount detection. The resulting UI isn't perfect, because when they
 * click the cancel button, users briefly see the page they asked before
 * seeing the form page again. But that's the best we can do.
 *
 * @see history.block()
 */
const useWarnWhenUnsavedChanges = (enable: boolean) => {
    const form = useForm();
    const history = useHistory();
    const translate = useTranslate();

    // Keep track of the current location inside the form (e.g. active tab)
    const formLocation = useRef(history.location);
    useEffect(() => {
        formLocation.current = history.location;
    }, [history.location]);

    useEffect(() => {
        if (!enable) {
            window.sessionStorage.removeItem('unsavedChanges');
            return;
        }

        // on mount: apply unsaved changes
        const unsavedChanges = JSON.parse(
            window.sessionStorage.getItem('unsavedChanges')
        );

        if (unsavedChanges) {
            Object.keys(unsavedChanges).forEach(key =>
                form.change(key, unsavedChanges[key])
            );
            window.sessionStorage.removeItem('unsavedChanges');
        }

        // on unmount : check and save unsaved changes, then cancel navigation
        return () => {
            const formState = form.getState();
            if (
                formState.dirty &&
                (!formState.submitSucceeded ||
                    (formState.submitSucceeded &&
                        formState.dirtySinceLastSubmit))
            ) {
                if (!window.confirm(translate('ra.message.unsaved_changes'))) {
                    const dirtyFields = formState.submitSucceeded
                        ? formState.dirtySinceLastSubmit
                        : formState.dirtyFields;
                    const dirtyFieldValues = Object.keys(dirtyFields).reduce(
                        (acc, key) => {
                            acc[key] = get(formState.values, key);
                            return acc;
                        },
                        {}
                    );
                    window.sessionStorage.setItem(
                        'unsavedChanges',
                        JSON.stringify(dirtyFieldValues)
                    );
                    history.push(formLocation.current);
                }
            } else {
                window.sessionStorage.removeItem('unsavedChanges');
            }
        };
    }, [translate]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useWarnWhenUnsavedChanges;
