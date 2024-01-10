import usePermissions from './usePermissions';

const emptyParams = {};

/**
 * @deprecated use usePermissions instead
 *
 * @see usePermissions
 */
const usePermissionsOptimized = (params = emptyParams) => {
    return usePermissions(params);
};

export default usePermissionsOptimized;
