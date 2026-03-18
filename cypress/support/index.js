/*
 * This is a workaround for the ResizeObserver loop error that occurs in Cypress.
 * See https://github.com/cypress-io/cypress/issues/20341
 * See https://github.com/cypress-io/cypress/issues/29277
 */

import ResizeObserverMock from './ResizeObserverMock';

Cypress.on('window:before:load', win => {
    win.ResizeObserver = ResizeObserverMock;
});
