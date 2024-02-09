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
    const { isSubmitSuccessful, isSubmitting, dirtyFields } = useFormState(
        control ? { control } : undefined
    );
    const isDirty = Object.keys(dirtyFields).length > 0;
    const [shouldNotify, setShouldNotify] = useState(false);

    const blocker = useBlocker(({ currentLocation, nextLocation }) => {
        if (!enable || !isDirty) return false;
        if (isSubmitting) return false;
        if (isSubmitSuccessful) return false;

        const initialLocation = formRootPathname || currentLocation.pathname;
        const newLocationIsInsideCurrentLocation = nextLocation.pathname.startsWith(
            initialLocation
        );
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
            setShouldNotify(true);
        }
    }, [blocker.state]);

    useEffect(() => {
        if (shouldNotify) {
            const shouldProceed = window.confirm(
                translate('ra.message.unsaved_changes')
            );
            if (shouldProceed) {
                blocker.proceed();
            } else {
                blocker.reset();
            }
        }
        setShouldNotify(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldNotify]);
};
