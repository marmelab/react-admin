import { default as defaultI18nProvider } from './defaultI18nProvider';
export { default as Admin } from './Admin';
export { default as AdminRouter } from './AdminRouter';

export * from 'ra-core';
export * from 'ra-ui-materialui';

// resolve the ambiguity
export { Notification, Pagination } from 'ra-ui-materialui';
