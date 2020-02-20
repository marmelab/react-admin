export default url => ({
    elements: {
        body: 'body',
        deleteButton: '.ra-delete-button',
        input: (name, type = 'input') => {
            if (type === 'rich-text-input') {
                return `.ra-input-${name} .ql-editor`;
            }
            return `.edit-page [name='${name}']`;
        },
        inputs: `.ra-input`,
        tabs: `.form-tab`,
        snackbar: 'div[role="alert"]',
        submitButton: ".edit-page div[role='toolbar'] button[type='submit']",
        cloneButton: '.button-clone',
        tab: index => `.form-tab:nth-of-type(${index})`,
        title: '#react-admin-title',
        userMenu: 'button[title="Profile"]',
        logout: '.logout',
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        return cy.get(this.elements.title);
    },

    setInputValue(type, name, value, clearPreviousValue = true) {
        if (clearPreviousValue) {
            cy.get(this.elements.input(name)).clear();
        }
        cy.get(this.elements.input(name)).type(value);
        if (type === 'rich-text-input') {
            cy.wait(500);
        }
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

    delete() {
        cy.get(this.elements.deleteButton).click();
        cy.get(this.elements.snackbar);
        cy.get(this.elements.body).click(); // dismiss notification
        cy.wait(200); // let the notification disappear (could block further submits)
    },

    clone() {
        cy.get(this.elements.cloneButton).click();
    },

    logout() {
        cy.get(this.elements.userMenu).click();
        cy.get(this.elements.logout).click();
    },
});
