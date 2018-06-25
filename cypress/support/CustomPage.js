/// <reference types="Cypress" />
/* globals cy */

export default url => ({
    elements: {
        appLoader: '.app-loader',
        total: '.total',
        layout: '.layout',
    },

    navigate() {
        cy.visit(url);
    },

    getTotal() {
        return cy.get(this.elements.total);
    },
});
