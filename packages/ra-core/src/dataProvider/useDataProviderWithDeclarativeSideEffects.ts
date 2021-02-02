import useDataProvider from './useDataProvider';
import { useMemo } from 'react';
import { DataProviderProxy } from '../types';
import useDeclarativeSideEffects from './useDeclarativeSideEffects';
import { getDataProviderCallArguments } from './getDataProviderCallArguments';

/**
 * This version of the useDataProvider hook ensure Query and Mutation components are still usable
 * with side effects declared as objects.
 *
 * @deprecated This is for backward compatibility only and will be removed in next major version.
 */
const useDataProviderWithDeclarativeSideEffects = (): DataProviderProxy => {
    const dataProvider = useDataProvider();
    const getSideEffects = useDeclarativeSideEffects();

    // @ts-ignore
    const dataProviderProxy = useMemo(() => {
        return new Proxy(dataProvider, {
            get: (target, name) => {
                if (typeof name === 'symbol') {
                    return;
                }
                return (...args) => {
                    const {
                        resource,
                        payload,
                        allArguments,
                        options,
                    } = getDataProviderCallArguments(args);

                    let onSuccess;
                    let onFailure;
                    let finalOptions = options;
                    let finalAllArguments = allArguments;

                    if (
                        options &&
                        Object.keys(options).some(key =>
                            ['onSuccess', 'onFailure'].includes(key)
                        )
                    ) {
                        const sideEffect = getSideEffects(
                            resource,
                            options as unknown
                        );
                        let {
                            onSuccess: ignoreOnSuccess, // Used to extract options without onSuccess
                            onFailure: ignoreOnFailure, // Used to extract options without onFailure
                            ...otherOptions
                        } = options;
                        onSuccess = sideEffect.onSuccess;
                        onFailure = sideEffect.onFailure;
                        finalOptions = otherOptions;
                        finalAllArguments = [...args].slice(0, args.length - 1);
                    }

                    try {
                        return target[name.toString()].apply(
                            target,
                            typeof resource === 'string'
                                ? [
                                      resource,
                                      payload,
                                      {
                                          ...finalOptions,
                                          onSuccess,
                                          onFailure,
                                      },
                                  ]
                                : finalAllArguments
                        );
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
