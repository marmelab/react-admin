import { downloadCSV } from './';
import { useResourceContext } from '../core';
import jsonexport from 'jsonexport/dist';
import useCanAccessCallback from '../auth/useCanAccessCallback';

const getAllKeys = (recordList: Record<string, unknown>[]): string[] => {
    const keys = recordList.reduce((acc: Set<string>, record) => {
        const keys = Object.keys(record);
        keys.forEach(acc.add);

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
export const useExporter = () => {
    const resource = useResourceContext();

    if (!resource) {
        throw new Error(
            `useExporter requires a non-empty resource prop or context`
        );
    }
    const canAccess = useCanAccessCallback();

    const defaultExporter = async (records: Record<string, unknown>[]) => {
        const keys = getAllKeys(records);

        const accessRecord = await keys.reduce(async (acc, key) => {
            const record = await acc;
            const canAccessResult = await canAccess({
                action: 'read',
                resource: `${resource}.${key}`,
            });

            return {
                ...record,
                [key]: !!canAccessResult.isAccessible,
            };
        }, Promise.resolve({}));

        const recordsWithAuthorizedColumns = records.map(record => {
            return Object.keys(record).reduce((acc, key) => {
                if (!accessRecord[key]) {
                    return acc;
                }

                return { ...acc, [key]: record[key] };
            }, {});
        });

        jsonexport(recordsWithAuthorizedColumns, (err, csv) =>
            downloadCSV(csv, resource)
        );
    };

    return defaultExporter;
};
