import {
    useNotify,
    useRedirect,
    useRefresh,
    useUnselectAll,
    NotificationSideEffect,
    RedirectionSideEffect,
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
            {
                onSuccess,
                onFailure,
            }: {
                onSuccess?: DeclarativeSideEffect;
                onFailure?: DeclarativeSideEffect;
            } = {
                onSuccess: undefined,
                onFailure: undefined,
            }
        ) => {
            const convertToFunctionSideEffect = (
                resource: string | undefined,
                sideEffects: DeclarativeSideEffect
            ) => {
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

export interface DeclarativeSideEffect {
    notification?: NotificationSideEffect;
    redirectTo?: RedirectionSideEffect;
    refresh?: boolean;
    unselectAll?: boolean;
}

export default useDeclarativeSideEffects;
