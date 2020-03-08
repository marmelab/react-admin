import {
    useNotify,
    useRedirect,
    useRefresh,
    useUnselectAll,
} from '../sideEffect';
import { useMemo } from 'react';

const useDeclarativeSideEffects = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const unselectAll = useUnselectAll();

    return useMemo(
        () => (
            resource,
            { onSuccess, onFailure }: any = {
                onSuccess: undefined,
                onFailure: undefined,
            }
        ) => {
            const convertToFunctionSideEffect = (resource, sideEffects) => {
                if (!sideEffects || typeof sideEffects === 'function') {
                    return sideEffects;
                }

                if (Object.keys(sideEffects).length === 0) {
                    return undefined;
                }

                const {
                    notification,
                    redirectTo,
                    refresh: needRefresh,
                    unselectAll: needUnselectAll,
                } = sideEffects;

                return () => {
                    if (notification) {
                        notify(
                            notification.body,
                            notification.level,
                            notification.messageArgs
                        );
                    }

                    if (redirectTo) {
                        redirect(redirectTo);
                    }

                    if (needRefresh) {
                        refresh();
                    }

                    if (needUnselectAll) {
                        unselectAll(resource);
                    }
                };
            };

            return {
                onSuccess: convertToFunctionSideEffect(resource, onSuccess),
                onFailure: convertToFunctionSideEffect(resource, onFailure),
            };
        },
        [notify, redirect, refresh, unselectAll]
    );
};

export default useDeclarativeSideEffects;
