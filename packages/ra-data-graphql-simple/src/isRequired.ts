import {
    IntrospectionType,
    IntrospectionListTypeRef,
    IntrospectionTypeRef,
    TypeKind,
} from 'graphql';

const isRequired = (
    type: IntrospectionType | IntrospectionListTypeRef | IntrospectionTypeRef
) => {
    if (type.kind === TypeKind.LIST) {
        return isRequired(type.ofType);
    }

    return type.kind === TypeKind.NON_NULL;
};

export default isRequired;
