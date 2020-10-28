export * from './dataFetchActions';
export * from './components';
export * from './ResourceContext';
export * from './ResourceProvider';
export * from './useGetResource';
export * from './useResource';
export * from './useResources';
// there seems to be a bug in TypeScript: this only works if the exports are in this order.
// Swapping the two exports leads to the core module missing the dataFetchActions constants
