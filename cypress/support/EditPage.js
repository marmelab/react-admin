/// <reference types="Cypress" />
/* globals cy */

export default url => ({
    elements: {
        body: 'body',
        input: name => `.edit-page input[name='${name}']`,
        inputs: `.ra-input`,
        tabs: `.form-tab`,
        submitButton: ".edit-page button[type='submit']",
        tab: index => `button.form-tab:nth-of-type(${index})`,
        title: '.title',
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        return cy.get(this.elements.title);
    },

    // getInputValue(name) {
    //     const input = driver.findElement(this.elements.input(name));
    //     return input.getAttribute('value');
    // },

    // getFields() {
    //     return driver.findElements(this.elements.inputs).then(fields =>
    //         Promise.all(
    //             fields.map(field =>
    //                 field.getAttribute('class').then(classes =>
    //                     classes
    //                         .split(' ')
    //                         .filter(className =>
    //                             className.startsWith('ra-input-')
    //                         )[0]
    //                         .replace('ra-input-', '')
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

    setInputValue(name, value, clearPreviousValue = true) {
        if (clearPreviousValue) {
            cy.get(this.elements.input(name)).clear();
        }
        return cy.get(this.elements.input(name)).type(value);
    },

    clickInput(name) {
        cy.get(this.elements.input(name)).click();
    },

    gotoTab(index) {
        cy.get(this.elements.tab(index)).click();
    },

    submit() {
        cy.get(this.elements.submitButton).click();
    },
});
