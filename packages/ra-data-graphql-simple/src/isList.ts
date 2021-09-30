import {
    IntrospectionType,
    IntrospectionTypeRef,
    IntrospectionNonNullTypeRef,
    TypeKind,
} from 'graphql';

const isList = (
    type: IntrospectionType | IntrospectionNonNullTypeRef | IntrospectionTypeRef
) => {
    if (type.kind === TypeKind.NON_NULL) {
        return isList(type.ofType);
    }

    return type.kind === TypeKind.LIST;
};

export default isList;
