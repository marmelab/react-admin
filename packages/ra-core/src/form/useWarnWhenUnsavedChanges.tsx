import { useEffect, useRef } from 'react';
import { useFormState } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

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
const useWarnWhenUnsavedChanges = (
    enable: boolean,
    formRootPathname?: string
) => {
    const history = useHistory();
    const translate = useTranslate();
    const { isDirty } = useFormState();
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

            if (isDirty && !isInsideForm) {
                return translate('ra.message.unsaved_changes');
            }

            return undefined;
        });

        return () => {
            if (release) {
                release();
            }
        };
    }, [isDirty, enable, history, translate]);
};

export default useWarnWhenUnsavedChanges;
