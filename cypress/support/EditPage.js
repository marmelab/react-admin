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
