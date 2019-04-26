import { TypeKind } from 'graphql';
import { GET_LIST, GET_MANY, GET_MANY_REFERENCE } from 'ra-core';
import getFinalType from './getFinalType';

const sanitizeResource = (introspectionResults, resource, aliases) => data => {
    const result = Object.keys(data).reduce((acc, key) => {
        if (key.startsWith('_')) {
            return acc;
        }

        const isAlias = aliases && aliases[key] ? true : false;
        const keyToFind = isAlias ? aliases[key].name : key;
        const field = resource.type.fields.find(f => f.name === keyToFind);
        const fieldName = isAlias ? aliases[key].alias : field.name;
        const type = getFinalType(field.type);

        if (type.kind !== TypeKind.OBJECT) {
            return { ...acc, [fieldName]: data[fieldName] };
        }

        // FIXME: We might have to handle linked types which are not resources but will have to be careful about
        // endless circular dependencies
        const linkedResource = introspectionResults.resources.find(
            r => r.type.name === type.name
        );

        if (linkedResource) {
            const linkedResourceData = data[fieldName];

            if (Array.isArray(linkedResourceData)) {
                return {
                    ...acc,
                    [fieldName]: data[fieldName].map(
                        sanitizeResource(introspectionResults, linkedResource)
                    ),
                    [`${fieldName}Ids`]: data[fieldName].map(d => d.id),
                };
            }

            return {
                ...acc,
                [`${fieldName}.id`]: linkedResourceData
                    ? data[fieldName].id
                    : undefined,
                [fieldName]: linkedResourceData
                    ? sanitizeResource(introspectionResults, linkedResource)(
                          data[fieldName]
                      )
                    : undefined,
            };
        }

        return { ...acc, [fieldName]: data[fieldName] };
    }, {});

    return result;
};

export default introspectionResults => (aorFetchType, resource) => (
    response,
    aliases
) => {
    const sanitize = sanitizeResource(introspectionResults, resource, aliases);
    const data = response.data;

    if (
        aorFetchType === GET_LIST ||
        aorFetchType === GET_MANY ||
        aorFetchType === GET_MANY_REFERENCE
    ) {
        return {
            data: response.data.items.map(sanitize),
            total: response.data.total.count,
        };
    }

    return { data: sanitize(data.data) };
};
