import { TypeKind } from 'graphql';

const isRequired = type => {
    if (type.kind === TypeKind.LIST) {
        return isRequired(type.ofType);
    }

    return type.kind === TypeKind.NON_NULL;
};

export default isRequired;
