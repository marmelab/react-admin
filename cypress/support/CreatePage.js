/// <reference types="Cypress" />
/* globals cy */

export default url => ({
    elements: {
        body: 'body',
        input: (name, type = 'input') => `.create-page ${type}[name='${name}']`,
        inputs: `.ra-input`,
        snackbar: 'div[role="alertdialog"]',
        submitButton: ".create-page button[type='submit']",
        submitAndAddButton:
            ".create-page form>div:last-child button[type='button']",
        descInput: '.ql-editor',
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        cy.get(this.elements.submitButton);
    },

    setInputValue(type, name, value, clearPreviousValue = true) {
        if (clearPreviousValue) {
            cy.get(this.elements.input(name, type)).clear();
        }
        cy.get(this.elements.input(name, type)).type(value);
    },

    setValues(values, clearPreviousValue = true) {
        values.forEach(val => {
            if (clearPreviousValue) {
                cy.get(this.elements.input(val.name, val.type)).clear();
            }
            cy.get(this.elements.input(val.name, val.type)).type(val.value);
        });
    },

    // getInputValue(name, type = 'input') {
    //     return driver
    //         .findElement(this.elements.input(name, type))
    //         .getAttribute('value');
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

    submit() {
        cy.get(this.elements.submitButton).click();
        cy.get(this.elements.snackbar);
        cy.get(this.elements.body).click(); // dismiss notification
        cy.wait(200); // let the notification disappear (could block further submits)
    },

    submitAndAdd() {
        cy.get(this.elements.submitAndAddButton).click();
        cy.get(this.elements.snackbar);
        cy.get(this.elements.body).click(); // dismiss notification
        cy.wait(200); // let the notification disappear (could block further submits)
    },
});
