// FIXME: This should be exported from the ra-core package
type CanAccessParams<
    RecordType extends Record<string, any> = Record<string, any>,
> = {
    action: string;
    resource: string;
    record?: RecordType;
};

export const canAccess = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    role: string,
    params: CanAccessParams<RecordType>
) => {
    if (role === 'admin') {
        return true;
    }

    // Non admins can't access the sales resource
    if (params.resource === 'sales') {
        return false;
    }

    return true;
};
