import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
} from 'react-admin';

import getFinalType from './getFinalType';
import isList from './isList';

const sanitizeValue = (type, value) => {
    if (type.name === 'Int') {
        return parseInt(value);
    }

    if (type.name === 'Float') {
        return parseFloat(value);
    }

    return value;
};

const buildGetListVariables = introspectionResults => (
    resource,
    aorFetchType,
    params
) => {
    const filter = Object.keys(params.filter).reduce((acc, key) => {
        if (key === 'ids') {
            return { ...acc, ids: params.filter[key] };
        }

        if (typeof params.filter[key] === 'object') {
            const type = introspectionResults.types.find(
                t => t.name === `${resource.type.name}Filter`
            );
            const filterSome = type.inputFields.find(
                t => t.name === `${key}_some`
            );

            if (filterSome) {
                const filter = Object.keys(params.filter[key]).reduce(
                    (acc, k) => ({
                        ...acc,
                        [`${k}_in`]: params.filter[key][k],
                    }),
                    {}
                );
                return { ...acc, [`${key}_some`]: filter };
            }
        }

        const parts = key.split('.');

        if (parts.length > 1) {
            if (parts[1] == 'id') {
                const type = introspectionResults.types.find(
                    t => t.name === `${resource.type.name}Filter`
                );
                const filterSome = type.inputFields.find(
                    t => t.name === `${parts[0]}_some`
                );

                if (filterSome) {
                    return {
                        ...acc,
                        [`${parts[0]}_some`]: { id: params.filter[key] },
                    };
                }

                return { ...acc, [parts[0]]: { id: params.filter[key] } };
            }

            const resourceField = resource.type.fields.find(
                f => f.name === parts[0]
            );
            const type = getFinalType(resourceField.type);
            return { ...acc, [key]: sanitizeValue(type, params.filter[key]) };
        }

        const resourceField = resource.type.fields.find(f => f.name === key);

        if (resourceField) {
            const type = getFinalType(resourceField.type);
            const isAList = isList(resourceField.type);

            if (isAList) {
                return {
                    ...acc,
                    [key]: Array.isArray(params.filter[key])
                        ? params.filter[key].map(value =>
                              sanitizeValue(type, value)
                          )
                        : sanitizeValue(type, [params.filter[key]]),
                };
            }

            return { ...acc, [key]: sanitizeValue(type, params.filter[key]) };
        }

        return { ...acc, [key]: params.filter[key] };
    }, {});

    return {
        page: parseInt(params.pagination.page) - 1,
        perPage: parseInt(params.pagination.perPage),
        sortField: params.sort.field,
        sortOrder: params.sort.order,
        filter,
    };
};

const buildCreateUpdateVariables = () => (
    resource,
    aorFetchType,
    params,
    queryType
) =>
    Object.keys(params.data).reduce((acc, key) => {
        if (Array.isArray(params.data[key])) {
            const arg = queryType.args.find(a => a.name === `${key}Ids`);

            if (arg) {
                return {
                    ...acc,
                    [`${key}Ids`]: params.data[key].map(({ id }) => id),
                };
            }
        }

        if (typeof params.data[key] === 'object') {
            const arg = queryType.args.find(a => a.name === `${key}Id`);

            if (arg) {
                return {
                    ...acc,
                    [`${key}Id`]: params.data[key].id,
                };
            }
        }

        return {
            ...acc,
            [key]: params.data[key],
        };
    }, {});

export default introspectionResults => (
    resource,
    aorFetchType,
    params,
    queryType
) => {
    switch (aorFetchType) {
        case GET_LIST: {
            return buildGetListVariables(introspectionResults)(
                resource,
                aorFetchType,
                params,
                queryType
            );
        }
        case GET_MANY:
            return {
                filter: { ids: params.ids },
            };
        case GET_MANY_REFERENCE: {
            const parts = params.target.split('.');

            return {
                filter: { [parts[0]]: { id: params.id } },
            };
        }
        case GET_ONE:
            return {
                id: params.id,
            };
        case UPDATE: {
            return buildCreateUpdateVariables(introspectionResults)(
                resource,
                aorFetchType,
                params,
                queryType
            );
        }

        case CREATE: {
            return buildCreateUpdateVariables(introspectionResults)(
                resource,
                aorFetchType,
                params,
                queryType
            );
        }

        case DELETE:
            return {
                id: params.id,
            };
    }
};
