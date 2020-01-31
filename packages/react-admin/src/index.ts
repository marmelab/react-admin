import Admin from './Admin';
import AdminUI from './AdminUI';
import AdminContext from './AdminContext';
import AdminRouter from './AdminRouter';
import defaultI18nProvider from './defaultI18nProvider';

export * from 'ra-core';
/* 
error - what do to? which one is the correct symbol?
Module 'ra-core' has already exported a member named 'Notification'. Consider explicitly re-exporting to resolve the ambiguity.ts(2308)
Module 'ra-core' has already exported a member named 'Pagination'. Consider explicitly re-exporting to resolve the ambiguity.ts(2308)
*/
// @ts-ignore
export * from 'ra-ui-materialui';
export { Admin, AdminContext, AdminRouter, AdminUI, defaultI18nProvider };
