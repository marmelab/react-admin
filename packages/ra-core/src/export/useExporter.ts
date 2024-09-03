import { defaultExporter } from './defaultExporter';
import { useCanAccessCallback } from '../auth/useCanAccessCallback';
import { Exporter } from '../types';

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
const useExporter = (params: { exporter?: Exporter | false }) => {
    const canAccess = useCanAccessCallback();
    if (params.exporter === false) {
        return false;
    }
    const exporter = params.exporter || defaultExporter;

    const exporterWithAccessControl = async (
        records: Record<string, unknown>[],
        _,
        __,
        resource
    ) => {
        const keys = getAllKeys(records);

        const accessRecord = await keys.reduce(async (acc, key) => {
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
                if (!accessRecord[key]) {
                    return acc;
                }

                return { ...acc, [key]: record[key] };
            }, {});
        });

        exporter(recordsWithAuthorizedColumns, _, __, resource);
    };

    return exporterWithAccessControl;
};

export default useExporter;
