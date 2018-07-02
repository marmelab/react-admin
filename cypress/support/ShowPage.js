export default (url, initialField = 'title') => ({
    elements: {
        body: 'body',
        deleteButton: '.ra-delete-button',
        field: name => `.ra-field-${name} > div > div > span`,
        fields: `.ra-field`,
        snackbar: 'div[role="alertdialog"]',
        tabs: `.show-tab`,
        tab: index => `.show-tab:nth-of-type(${index})`,
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        cy.get(this.elements.field(initialField));
    },

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
