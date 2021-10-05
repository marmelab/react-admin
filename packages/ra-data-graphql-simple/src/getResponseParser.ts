import { GET_LIST, GET_MANY, GET_MANY_REFERENCE } from 'ra-core';
import { IntrospectionResult, IntrospectedResource } from 'ra-data-graphql';
import { IntrospectionField } from 'graphql';
import { ApolloQueryResult } from '@apollo/client';

export default (introspectionResults: IntrospectionResult) => (
    raFetchMethod: string,
    resource: IntrospectedResource,
    queryType: IntrospectionField
) => (response: ApolloQueryResult<any>) => {
    const data = response.data;

    if (
        raFetchMethod === GET_LIST ||
        raFetchMethod === GET_MANY ||
        raFetchMethod === GET_MANY_REFERENCE
    ) {
        return {
            data: response.data.items.map(sanitizeResource),
            total: response.data.total.count,
        };
    }

    return { data: sanitizeResource(data.data) };
};

const sanitizeResource = (data: any) => {
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
