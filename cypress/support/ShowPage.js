/// <reference types="Cypress" />
/* globals cy */

export default (url, initialField = 'title') => ({
    elements: {
        body: 'body',
        deleteButton: '.ra-delete-button',
        field: name => `.ra-field-${name} > div > div > span`,
        fields: `.ra-field`,
        snackbar: 'div[role="alertdialog"]',
        tabs: `.show-tab`,
        tab: index => `button.show-tab:nth-of-type(${index})`,
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        cy.get(this.elements.field(initialField));
    },

    // getValue(name) {
    //     return driver.findElement(this.elements.field(name)).getText();
    // },

    // getFields() {
    //     return driver.findElements(this.elements.fields).then(fields =>
    //         Promise.all(
    //             fields.map(field =>
    //                 field.getAttribute('class').then(classes =>
    //                     classes
    //                         .split(' ')
    //                         .filter(className =>
    //                             className.startsWith('ra-field-')
    //                         )[0]
    //                         .replace('ra-field-', '')
    //                 )
    //             )
    //         )
    //     );
    // },

    // getTabs() {
    //     return driver
    //         .findElements(this.elements.tabs)
    //         .then(tabs => Promise.all(tabs.map(tab => tab.getText())));
    // },

    gotoTab(index) {
        cy.get(this.elements.tab(index)).click();
    },

    delete() {
        cy.get(this.elements.deleteButton).click();
        cy.get(this.elements.snackbar);
        cy.get(this.elements.body).click(); // dismiss notification
        cy.wait(200); // let the notification disappear (could block further submits)
    },
});
