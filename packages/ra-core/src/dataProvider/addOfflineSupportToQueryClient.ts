import type { QueryClient } from '@tanstack/react-query';
import { DATAPROVIDER_MUTATIONS } from './dataFetchActions';
import type { DataProvider } from '../types';

/**
 * A function that registers default functions on the queryClient for the specified mutations and resources.
 * react-query requires default mutation functions to allow resumable mutations (https://tanstack.com/query/latest/docs/framework/react/guides/mutations#persisting-offline-mutations)
 * (e.g. mutations triggered while offline and users navigated away from the component that triggered them).
 *
 * @example <caption>Adding offline support for the default mutations</caption>
 * // in src/App.tsx
 * import { addOfflineSupportToQueryClient } from 'react-admin';
 * import { QueryClient } from '@tanstack/react-query';
 * import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
 * import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
 * import { dataProvider } from './dataProvider';
 * import { posts } from './posts';
 * import { comments } from './comments';
 *
 * const localStoragePersister = createAsyncStoragePersister({
 *     storage: window.localStorage,
 * });
 *
 * const queryClient = addOfflineSupportToQueryClient({
 *   queryClient: new QueryClient(),
 *   dataProvider,
 *   resources: ['posts', 'comments'],
 * });
 *
 * const App = () => (
 *     <PersistQueryClientProvider
 *         client={queryClient}
 *         persistOptions={{ persister: localStoragePersister }}
 *         onSuccess={() => {
 *             // resume mutations after initial restore from localStorage was successful
 *             queryClient.resumePausedMutations();
 *         }}
 *     >
 *         <Admin queryClient={queryClient} dataProvider={dataProvider}>
 *             <Resource name="posts" {...posts} />
 *             <Resource name="comments" {...comments} />
 *         </Admin>
 *     </PersistQueryClientProvider>
 * );
 *
 * @example <caption>Adding offline support with custom mutations</caption>
 * // in src/App.tsx
 * import { Admin, Resource, addOfflineSupportToQueryClient, DataProviderMutations } from 'react-admin';
 * import { QueryClient } from '@tanstack/react-query';
 * import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
 * import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
 * import { dataProvider } from './dataProvider';
 * import { posts } from './posts';
 * import { comments } from './comments';
 *
 * const localStoragePersister = createSyncStoragePersister({
 *     storage: window.localStorage,
 * });
 *
 * const queryClient = addOfflineSupportToQueryClient({
 *   queryClient: new QueryClient(),
 *   dataProvider,
 *   resources: ['posts', 'comments'],
 * });
 *
 * const App = () => (
 *     <PersistQueryClientProvider
 *         client={queryClient}
 *         persistOptions={{ persister: localStoragePersister }}
 *         onSuccess={() => {
 *             // resume mutations after initial restore from localStorage was successful
 *             queryClient.resumePausedMutations();
 *         }}
 *     >
 *         <Admin queryClient={queryClient} dataProvider={dataProvider}>
 *             <Resource name="posts" {...posts} />
 *             <Resource name="comments" {...comments} />
 *         </Admin>
 *     </PersistQueryClientProvider>
 * );
 */
export const addOfflineSupportToQueryClient = ({
    dataProvider,
    resources,
    queryClient,
}: {
    dataProvider: DataProvider;
    resources: string[];
    queryClient: QueryClient;
}) => {
    resources.forEach(resource => {
        DATAPROVIDER_MUTATIONS.forEach(mutation => {
            queryClient.setMutationDefaults([resource, mutation], {
                mutationFn: async (params: any) => {
                    const dataProviderFn = dataProvider[mutation] as Function;
                    return dataProviderFn.apply(dataProviderFn, ...params);
                },
            });
        });
    });

    return queryClient;
};
