export const DECLARE_RESOURCE = 'AOR/DECLARE_RESOURCE';

export const declareResource = (resource) => ({
    type: DECLARE_RESOURCE,
    payload: resource,
});
