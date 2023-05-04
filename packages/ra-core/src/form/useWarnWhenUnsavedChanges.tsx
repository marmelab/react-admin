import { useContext, useEffect, useRef } from 'react';
import { useFormState, Control } from 'react-hook-form';
import { UNSAFE_NavigationContext, useLocation } from 'react-router-dom';
import { History, Transition } from 'history';
import { useTranslate } from '../i18n';

/**
 * Display a confirmation dialog if the form has unsaved changes.
 * - If the user confirms, the navigation continues and the changes are lost.
 * - If the user cancels, the navigation is cancelled and the changes are kept.
 */
export const useWarnWhenUnsavedChanges = (
    enable: boolean,
    formRootPathname?: string,
    control?: Control
) => {
    // react-router v6 does not yet provide a way to block navigation
    // This is planned for a future release
    // See https://github.com/remix-run/react-router/issues/8139
    const navigator = useContext(UNSAFE_NavigationContext).navigator as History;
    const location = useLocation();
    const translate = useTranslate();
    const { isSubmitSuccessful, isSubmitting, dirtyFields } = useFormState(
        control ? { control } : undefined
    );
    const isDirty = Object.keys(dirtyFields).length > 0;
    const initialLocation = useRef(formRootPathname || location.pathname);

    useEffect(() => {
        if (!enable || !isDirty) return;
        if (!navigator.block) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    'warnWhenUnsavedChanged is not compatible with react-router >= 6.4. If you need this feature, please downgrade react-router to 6.3.0'
                );
            }
            return;
        }

        let unblock = navigator.block((tx: Transition) => {
            const newLocationIsInsideCurrentLocation = tx.location.pathname.startsWith(
                initialLocation.current
            );
            const newLocationIsShowView = tx.location.pathname.startsWith(
                `${initialLocation.current}/show`
            );
            const newLocationIsInsideForm =
                newLocationIsInsideCurrentLocation && !newLocationIsShowView;

            if (
                !isSubmitting &&
                (newLocationIsInsideForm ||
                    isSubmitSuccessful ||
                    window.confirm(translate('ra.message.unsaved_changes')))
            ) {
                unblock();
                tx.retry();
            } else {
                if (isSubmitting) {
                    // Retry the transition (possibly several times) until the form is no longer submitting.
                    // The value of 100ms is arbitrary, it allows to give some time between retries.
                    setTimeout(() => {
                        tx.retry();
                    }, 100);
                }
            }
        });

        return unblock;
    }, [
        enable,
        location,
        navigator,
        isDirty,
        isSubmitting,
        isSubmitSuccessful,
        translate,
    ]);
};
