import {
    useNotify,
    useRedirect,
    useRefresh,
    useUnselectAll,
    NotificationSideEffect,
    RedirectionSideEffect,
} from '../sideEffect';
import { OnSuccess, OnFailure } from '../types';
import { useMemo } from 'react';

const defaultSideEffects = {
    onSuccess: undefined,
    onFailure: undefined,
};
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
            }: DeclarativeSideEffects = defaultSideEffects
        ): FunctionSideEffects => {
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
                        notify(notification.body, {
                            type: notification.level,
                            messageArgs: notification.messageArgs,
                        });
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

export interface DeclarativeSideEffects {
    onSuccess?: DeclarativeSideEffect;
    onFailure?: DeclarativeSideEffect;
}
export interface FunctionSideEffects {
    onSuccess: OnSuccess;
    onFailure: OnFailure;
}

export default useDeclarativeSideEffects;
