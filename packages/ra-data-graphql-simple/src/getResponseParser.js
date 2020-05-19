import { GET_LIST, GET_MANY, GET_MANY_REFERENCE } from 'ra-core';

const sanitizeResource = data => {
    const result = Object.keys(data).reduce((acc, key) => {
        if (key.startsWith('_')) {
            return acc;
        }

        const dataKey = data[key];

        if (dataKey === null || dataKey === undefined) {
            return acc;
        }

        if (Array.isArray(dataKey)) {
            if (typeof dataKey[0] === 'object' && dataKey[0] !== null) {
                return {
                    ...acc,
                    [key]: dataKey.map(sanitizeResource),
                    [`${key}Ids`]: dataKey.map(d => d.id),
                };
            } else {
                return { ...acc, [key]: dataKey };
            }
        }

        if (typeof dataKey === 'object' && dataKey !== null) {
            return {
                ...acc,
                ...(dataKey &&
                    dataKey.id && {
                        [`${key}.id`]: dataKey.id,
                    }),
                [key]: sanitizeResource(dataKey),
            };
        }

        return { ...acc, [key]: dataKey };
    }, {});

    return result;
};

export default introspectionResults => aorFetchType => response => {
    const data = response.data;

    if (
        aorFetchType === GET_LIST ||
        aorFetchType === GET_MANY ||
        aorFetchType === GET_MANY_REFERENCE
    ) {
        return {
            data: response.data.items.map(sanitizeResource),
            total: response.data.total.count,
        };
    }

    return { data: sanitizeResource(data.data) };
};
