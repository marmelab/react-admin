import { TypeKind } from 'graphql';

const isList = type => {
    if (type.kind === TypeKind.NON_NULL) {
        return isList(type.ofType);
    }

    return type.kind === TypeKind.LIST;
};

export default isList;
