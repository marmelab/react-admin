import {
    IntrospectionType,
    IntrospectionTypeRef,
    TypeKind,
    TypeNode,
} from 'graphql';
import * as gqlTypes from 'graphql-ast-types-browser';

const isWrappingTypeRef = (
    type: IntrospectionType | IntrospectionTypeRef
): type is Extract<IntrospectionTypeRef, { ofType: unknown }> =>
    type.kind === TypeKind.LIST || type.kind === TypeKind.NON_NULL;

export const getGqlType = (
    type: IntrospectionType | IntrospectionTypeRef
): TypeNode => {
    if (isWrappingTypeRef(type)) {
        return type.kind === TypeKind.LIST
            ? gqlTypes.listType(getGqlType(type.ofType))
            : gqlTypes.nonNullType(getGqlType(type.ofType));
    }

    return gqlTypes.namedType(gqlTypes.name(type.name));
};
