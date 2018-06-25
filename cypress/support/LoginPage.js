/// <reference types="Cypress" />
/* globals cy */

export default url => ({
    elements: {
        username: "input[name='username']",
        password: "input[name='password']",
        submitButton: 'button',
    },

    navigate() {
        cy.visit(url);
        this.waitUntilVisible();
    },

    waitUntilVisible() {
        cy.get(this.elements.username);
    },

    login(username = 'login', password = 'password') {
        const usernameField = cy.get(this.elements.username);
        usernameField.type(username);
        const passwordField = cy.get(this.elements.password);
        passwordField.type(password);
        const submitButton = cy.get(this.elements.submitButton);
        return submitButton.click();
    },
});
