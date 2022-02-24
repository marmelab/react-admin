import { DataProvider } from '../types';
import { defaultDataProvider } from './defaultDataProvider';

export type DataProviderMatcher = (resource: string) => DataProvider;

/**
 * Combine multiple data providers into one.
 *
 * @param dataProviderMatcher A function that returns a data provider for a given resource.
 *
 * @example
 * const dataProvider = combineDataProviders(resource => {
 *    switch(resource) {
 *       case 'posts':
 *       case 'comments':
 *          return dataProvider1;
 *       case 'users':
 *          return dataProvider2;
 *       default:
 *         throw new Error('Unknown resource');
 *    }
 * });
 */
export const combineDataProviders = (
    dataProviderMatcher: DataProviderMatcher
): DataProvider =>
    new Proxy(defaultDataProvider, {
        get: (target, name) => {
            return (resource, params) => {
                if (typeof name === 'symbol' || name === 'then') {
                    return;
                }
                return dataProviderMatcher(resource)[name](resource, params);
            };
        },
    });
