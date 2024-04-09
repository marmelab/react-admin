import 'cypress-plugin-tab';

Cypress.on('uncaught:exception', (err, runnable) => {
    if (
        err.message.includes(
            'ResizeObserver loop completed with undelivered notifications'
        )
    ) {
        return false;
    }
});
