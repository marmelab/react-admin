import { TypeKind } from 'graphql';
import { GET_LIST, GET_MANY, GET_MANY_REFERENCE } from 'ra-core';
import getFinalType from './getFinalType';

const sanitizeResource = (introspectionResults, resource) => data => {
    const result = Object.keys(data).reduce((acc, key) => {
        if (key.startsWith('_')) {
            return acc;
        }

        const field = resource.type.fields.find(f => f.name === key);
        const type = getFinalType(field.type);

        if (type.kind !== TypeKind.OBJECT) {
            return { ...acc, [field.name]: data[field.name] };
        }

        // FIXME: We might have to handle linked types which are not resources but will have to be careful about
        // endless circular dependencies
        const linkedResource = introspectionResults.resources.find(r => r.type.name === type.name);

        if (linkedResource) {
            const linkedResourceData = data[field.name];

            if (Array.isArray(linkedResourceData)) {
                return {
                    ...acc,
                    [field.name]: data[field.name].map(sanitizeResource(introspectionResults, linkedResource)),
                    [`${field.name}Ids`]: data[field.name].map(d => d.id),
                };
            }

            return {
                ...acc,
                [`${field.name}.id`]: linkedResourceData ? data[field.name].id : undefined,
                [field.name]: linkedResourceData
                    ? sanitizeResource(introspectionResults, linkedResource)(data[field.name])
                    : undefined,
            };
        }

        return { ...acc, [field.name]: data[field.name] };
    }, {});

    return result;
};

export default introspectionResults => (aorFetchType, resource) => response => {
    const sanitize = sanitizeResource(introspectionResults, resource);
    const data = response.data;

    if (aorFetchType === GET_LIST || aorFetchType === GET_MANY || aorFetchType === GET_MANY_REFERENCE) {
        return {
            data: response.data.items.map(sanitize),
            total: response.data.total.count,
        };
    }

    return { data: sanitize(data.data) };
};
