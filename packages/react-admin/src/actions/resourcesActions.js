export const DECLARE_RESOURCES = 'RA/DECLARE_RESOURCES';

export const declareResources = resources => ({
    type: DECLARE_RESOURCES,
    payload: resources,
});
