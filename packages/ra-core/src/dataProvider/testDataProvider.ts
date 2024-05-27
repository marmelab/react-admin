import { DataProvider } from '../types';
import { defaultDataProvider } from './defaultDataProvider';

/**
 * A dataProvider meant to be used in tests only. You can override any of its methods by passing a partial dataProvider.
 *
 * @example
 * const dataProvider = testDataProvider({
 *    getOne: async () => ({ data: { id: 123, title: 'foo' }})
 * })
 */
export const testDataProvider = (
    overrides?: Partial<DataProvider>
): DataProvider => ({
    ...defaultDataProvider,
    ...overrides,
});
