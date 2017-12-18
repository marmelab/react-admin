export const REGISTER_RESOURCE = 'RA/REGISTER_RESOURCE';
export const UNREGISTER_RESOURCE = 'RA/UNREGISTER_RESOURCE';

export const registerResource = resource => ({
    type: REGISTER_RESOURCE,
    payload: resource,
});

export const unregisterResource = resourceName => ({
    type: UNREGISTER_RESOURCE,
    payload: resourceName,
});
