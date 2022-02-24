export default (url, initialField = 'title') => ({
    elements: {
        body: 'body',
        field: name => `.ra-field-${name} > p > span`,
        fields: `.ra-field`,
        snackbar: 'div[role="alertdialog"]',
        tabs: `.show-tab`,
        tab: index => `.show-tab:nth-of-type(${index})`,
        userMenu: 'button[aria-label="Profile"]',
        logout: '.logout',
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        cy.get(this.elements.field(initialField)).should('be.visible');
    },

    gotoTab(index) {
        cy.get(this.elements.tab(index)).click();
    },

    logout() {
        cy.get(this.elements.userMenu).click();
        cy.get(this.elements.logout).click();
    },
});
