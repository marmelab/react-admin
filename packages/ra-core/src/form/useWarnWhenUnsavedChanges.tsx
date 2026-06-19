import { useEffect, useState } from 'react';
import { Control, useFormState } from 'react-hook-form';
import { useTranslate } from '../i18n';
import { useBlocker } from '../routing/useBlocker';

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
        if (blocker.state !== 'blocked') return;

        // Proceed automatically when the form becomes safe to leave while the
        // navigation is blocked. This covers two cases where the redirect and
        // the form reset happen during the same tick (and the reset may only be
        // reflected one tick after the block):
        // - a successful save resets the form;
        // - a successful delete resets the form (the record no longer exists,
        //   so the unsaved changes are moot).
        if (shouldNotBlock) {
            blocker.proceed && blocker.proceed();
            return;
        }

        setShouldNotify(true);
        // Can't use blocker in the dependency array because it is not stable across rerenders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocker.state, shouldNotBlock]);

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
