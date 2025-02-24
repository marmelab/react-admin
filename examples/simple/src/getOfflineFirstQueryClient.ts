import { QueryClient } from '@tanstack/react-query';
import { DataProvider } from 'react-admin';

const DEFAULT_MUTATIONS = [
    'create',
    'delete',
    'update',
    'updateMany',
    'deleteMany',
];

/**
 * react-query requires default mutation functions to allow resumable mutations
 * (e.g. mutations triggered while offline and users navigated away from the component that triggered them).
 * This simple implementation does not handle custom mutations.
 */
export const getOfflineFirstQueryClient = ({
    queryClient,
    dataProvider,
    resources,
    mutations = DEFAULT_MUTATIONS,
}: {
    queryClient: QueryClient;
    dataProvider: DataProvider;
    resources: string[];
    mutations?: string[];
}) => {
    resources.forEach(resource => {
        mutations.forEach(mutation => {
            queryClient.setMutationDefaults([resource, mutation], {
                mutationFn: async params => {
                    return dataProvider[mutation](resource, params);
                },
            });
        });
    });

    return queryClient;
};
