export const DECLARE_RESOURCES = 'AOR/DECLARE_RESOURCES';

export const declareResources = resources => ({
    type: DECLARE_RESOURCES,
    payload: resources,
});
