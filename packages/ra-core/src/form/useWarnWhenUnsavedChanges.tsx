import { useCallback, useContext, useEffect, useRef } from 'react';
import { useFormState, UseFormStateParams } from 'react-final-form';
import { UNSAFE_NavigationContext, useLocation } from 'react-router-dom';
import { Blocker, History, Transition } from 'history';
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
    const location = useLocation();
    const translate = useTranslate();
    const { pristine } = useFormState(UseFormStateSubscription);
    const initialLocation = useRef(formRootPathname || location.pathname);
    const isInsideForm = location.pathname.startsWith(initialLocation.current);
    usePrompt(
        translate('ra.message.unsaved_changes'),
        enable && !pristine && !isInsideForm
    );
};

const UseFormStateSubscription: UseFormStateParams = {
    // For some reason, subscribing only to pristine does not rerender when a field become dirty
    // because it has a defaultValue (not initialValue as setting an initialValue does not make the field dirty)
    subscription: { pristine: true, dirtyFields: true },
};

export default useWarnWhenUnsavedChanges;

export function usePrompt(message: string, when = true) {
    let blocker = useCallback(
        tx => {
            if (window.confirm(message)) {
                tx.retry();
            }
        },
        [message]
    );

    useBlocker(blocker, when);
}

export function useBlocker(blocker: Blocker, when = true): void {
    const navigator = useContext(UNSAFE_NavigationContext).navigator as History;

    useEffect(() => {
        if (!when) return;

        let unblock = navigator.block((tx: Transition) => {
            let autoUnblockingTx = {
                ...tx,
                retry() {
                    // Automatically unblock the transition so it can play all the way
                    // through before retrying it. TODO: Figure out how to re-enable
                    // this block if the transition is cancelled for some reason.
                    unblock();
                    tx.retry();
                },
            };

            blocker(autoUnblockingTx);
        });

        return unblock;
    }, [navigator, blocker, when]);
}
