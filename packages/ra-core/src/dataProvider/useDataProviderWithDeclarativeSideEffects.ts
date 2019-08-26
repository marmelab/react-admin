import {
    useNotify,
    useRedirect,
    useRefresh,
    useUnselectAll,
} from '../sideEffect';
import useDataProvider, { DataProviderHookFunction } from './useDataProvider';
import { useCallback } from 'react';

const useDataProviderWithDeclarativeSideEffects = (): DataProviderHookFunction => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const unselectAll = useUnselectAll();

    return useCallback(
        (type: string, resource: string, params: any, options: any = {}) => {
            const convertToFunctionSideEffect = sideEffects => {
                if (
                    typeof sideEffects === 'undefined' ||
                    typeof sideEffects === 'function'
                ) {
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
                        unselectAll();
                    }
                };
            };

            const onSuccess = convertToFunctionSideEffect(options.onSuccess);
            const onFailure = convertToFunctionSideEffect(options.onFailure);
            const result = dataProvider(type, resource, params, {
                ...options,
                onSuccess,
                onFailure,
            });

            return result;
        },
        [dataProvider, notify, redirect, refresh, unselectAll]
    );
};

export default useDataProviderWithDeclarativeSideEffects;
