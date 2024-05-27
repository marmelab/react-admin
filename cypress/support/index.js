import 'cypress-plugin-tab';

/*
 * This is a workaround for the ResizeObserver loop error that occurs in Cypress.
 * See https://github.com/cypress-io/cypress/issues/20341
 * See https://github.com/cypress-io/cypress/issues/29277
 */
Cypress.on('uncaught:exception', err => {
    if (
        err.message.includes(
            'ResizeObserver loop completed with undelivered notifications'
        )
    ) {
        return false;
    }
});
