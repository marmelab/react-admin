import { TypeKind } from 'graphql';

/**
 * Ensure we get the real type even if the root type is NON_NULL or LIST
 * @param {GraphQLType} type
 */
const getFinalType = type => {
    if (type.kind === TypeKind.NON_NULL || type.kind === TypeKind.LIST) {
        return getFinalType(type.ofType);
    }

    return type;
};

export default getFinalType;
