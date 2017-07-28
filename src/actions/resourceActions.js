export const DECLARE_RESOURCE = 'AOR/DECLARE_RESOURCE';

export const declareResource = ({ name, icon, showInMenu, options }) => ({
    type: DECLARE_RESOURCE,
    payload: { icon, showInMenu, options },
    meta: { resource: name },
});
