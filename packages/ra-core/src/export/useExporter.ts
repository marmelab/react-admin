import { defaultExporter } from './defaultExporter';
import { useCanAccessCallback } from '../auth/useCanAccessCallback';
import { Exporter } from '../types';

/**
 * Initialize default exporter with access control
 *
 * @return {Function} exporter function
 *
 * @example
 *
 * import { useExporter } from 'react-admin';
 * import ListView from './ListView';
 *
 * const MyList = props => {
 *     const exporter = useExporter();
 *     return <ListView exporter={exporter} {...props} />;
 * }
 */
export const useExporter = (params: { exporter?: Exporter | false }) => {
    const canAccess = useCanAccessCallback();
    if (params.exporter === false) {
        return false;
    }
    const exporter = params.exporter || defaultExporter;

    const exporterWithAccessControl = async (
        records: Record<string, unknown>[],
        fetchRelatedRecords,
        dataProvider,
        resource
    ) => {
        const keys = getAllKeys(records);

        const authorizedKeys = await keys.reduce(async (acc, key) => {
            const record = await acc;
            const canAccessResult = await canAccess({
                action: 'read',
                resource: `${resource}.${key}`,
            });

            return {
                ...record,
                [key]: !!canAccessResult.canAccess,
            };
        }, Promise.resolve({}));

        if (!records) {
            return;
        }

        const recordsWithAuthorizedColumns = records.map(record => {
            return Object.keys(record).reduce((acc, key) => {
                if (!authorizedKeys[key]) {
                    return acc;
                }

                return { ...acc, [key]: record[key] };
            }, {});
        });

        return exporter(
            recordsWithAuthorizedColumns,
            fetchRelatedRecords,
            dataProvider,
            resource
        );
    };

    return exporterWithAccessControl;
};

export const getAllKeys = (
    recordList: Record<string, unknown>[] | undefined
): string[] => {
    const keys = (recordList || []).reduce((acc: Set<string>, record) => {
        const keys = Object.keys(record);
        keys.forEach(key => acc.add(key));

        return acc;
    }, new Set<string>());

    return Array.from(keys);
};
