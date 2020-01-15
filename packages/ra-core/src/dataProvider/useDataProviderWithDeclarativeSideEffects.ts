import useDataProvider from './useDataProvider';
import { useMemo } from 'react';
import { DataProvider, UseDataProviderOptions } from '../types';
import useDeclarativeSideEffects from './useDeclarativeSideEffects';

/**
 * This version of the useDataProvider hook ensure Query and Mutation components are still usable
 * with side effects declared as objects.
 *
 * @deprecated This is for backward compatibility only and will be removed in next major version.
 */
const useDataProviderWithDeclarativeSideEffects = (): DataProvider => {
    const dataProvider = useDataProvider();
    const getSideEffects = useDeclarativeSideEffects();

    const dataProviderProxy = useMemo(() => {
        return new Proxy(dataProvider, {
            get: (target, name) => {
                return (
                    resource: string,
                    payload: any,
                    options: UseDataProviderOptions
                ) => {
                    const { onSuccess, onFailure } = getSideEffects(
                        resource,
                        options
                    );
                    try {
                        return target[name.toString()](resource, payload, {
                            ...options,
                            onSuccess,
                            onFailure,
                        });
                    } catch (e) {
                        // turn synchronous exceptions (e.g. in parameter preparation)
                        // into async ones, otherwise they'll be lost
                        return Promise.reject(e);
                    }
                };
            },
        });
    }, [dataProvider, getSideEffects]);

    return dataProviderProxy;
};

export default useDataProviderWithDeclarativeSideEffects;
