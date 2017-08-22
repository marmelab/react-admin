export * from './accumulateActions';
export * from './authActions';
export * from './dataActions';
export * from './fetchActions';
export * from './filterActions';
export * from './formActions';
export * from './listActions';
export * from './localeActions';
export * from './notificationActions';
export * from './uiActions';

export const DECLARE_RESOURCES = 'AOR/DECLARE_RESOURCES';

export const declareResources = resources => ({
    type: DECLARE_RESOURCES,
    payload: resources,
});
