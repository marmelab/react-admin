import { useEffect, useState } from 'react';
import { Control, useFormState } from 'react-hook-form';
import { useBlocker } from 'react-router-dom';
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
    const translate = useTranslate();
    const { isSubmitSuccessful, dirtyFields } = useFormState(
        control ? { control } : undefined
    );
    const isDirty = Object.keys(dirtyFields).length > 0;
    const [shouldNotify, setShouldNotify] = useState(false);

    const shouldNotBlock = !enable || !isDirty || isSubmitSuccessful;

    const blocker = useBlocker(({ currentLocation, nextLocation }) => {
        if (shouldNotBlock) return false;

        // Also check if the new location is inside the form
        const initialLocation = formRootPathname || currentLocation.pathname;
        const newLocationIsInsideCurrentLocation =
            nextLocation.pathname.startsWith(initialLocation);
        const newLocationIsShowView = nextLocation.pathname.startsWith(
            `${initialLocation}/show`
        );
        const newLocationIsInsideForm =
            newLocationIsInsideCurrentLocation && !newLocationIsShowView;
        if (newLocationIsInsideForm) return false;

        return true;
    });

    useEffect(() => {
        if (blocker.state === 'blocked') {
            // Corner case: the blocker might be triggered by a redirect in the onSuccess side effect,
            // happening during the same tick the form is reset after a successful save.
            // In that case, the blocker will block but shouldNotBlock will be true one tick after.
            // If we are in that case, we can proceed immediately.
            if (shouldNotBlock) {
                blocker.proceed();
                return;
            }

            setShouldNotify(true);
        }
        // This effect should only run when the blocker state changes, not when shouldNotBlock changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocker.state]);

    useEffect(() => {
        if (shouldNotify) {
            const shouldProceed = window.confirm(
                translate('ra.message.unsaved_changes')
            );
            if (shouldProceed) {
                blocker.proceed && blocker.proceed();
            } else {
                blocker.reset && blocker.reset();
            }
        }
        setShouldNotify(false);
        // Can't use blocker in the dependency array because it is not stable across rerenders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldNotify, translate]);

    // This effect handles document navigation, e.g. closing the tab
    useEffect(() => {
        const beforeunload = (e: BeforeUnloadEvent) => {
            // Invoking event.preventDefault() will trigger a warning dialog when the user closes or navigates the tab
            // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#examples
            e.preventDefault();
            // Included for legacy support, e.g. Chrome/Edge < 119
            e.returnValue = true;
        };

        if (shouldNotBlock) {
            return;
        }

        window.addEventListener('beforeunload', beforeunload);

        return () => {
            window.removeEventListener('beforeunload', beforeunload);
        };
    }, [shouldNotBlock]);
};
