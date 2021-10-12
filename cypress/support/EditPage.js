export default url => ({
    elements: {
        body: 'body',
        deleteButton: '.ra-delete-button',
        addBacklinkButton: '.button-add-backlinks',
        input: (name, type = 'input') => {
            if (type === 'rich-text-input') {
                return `.ra-input-${name} .ql-editor`;
            }
            if (type === 'checkbox-group-input') {
                return `.ra-input-${name} label`;
            }
            if (type === 'reference-array-input') {
                return `.ra-input div[role=combobox] input`;
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
        userMenu: 'button[aria-label="Profile"]',
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

    clickInput(name, type = 'input') {
        cy.get(this.elements.input(name, type)).click();
    },

    gotoTab(index) {
        cy.get(this.elements.tab(index)).click({ force: true });
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
