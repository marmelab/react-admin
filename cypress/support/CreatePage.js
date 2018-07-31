export default url => ({
    elements: {
        addAuthor: '.button-add-authors',
        body: 'body',
        input: (name, type = 'input') => `.create-page ${type}[name='${name}']`,
        inputs: `.ra-input`,
        snackbar: 'div[role="alertdialog"]',
        submitButton: ".create-page button[type='submit']",
        submitAndAddButton:
            ".create-page form>div:last-child button[type='button']:nth-child(2)",
        submitCommentable:
            ".create-page form>div:last-child button[type='button']:last-child",
        descInput: '.ql-editor',
        tab: index => `.form-tab:nth-of-type(${index})`,
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        cy.get(this.elements.submitButton);
    },

    setInputValue(type, name, value, clearPreviousValue = true) {
        if (type === 'checkbox') {
            if (value === true) {
                return cy.get(this.elements.input(name, 'input')).check();
            }
            return cy.get(this.elements.input(name, 'input')).check();
        }
        if (clearPreviousValue) {
            cy.get(this.elements.input(name, type)).clear();
        }
        cy.get(this.elements.input(name, type)).type(value);
    },

    setValues(values, clearPreviousValue = true) {
        values.forEach(val => {
            this.setInputValue(
                val.type,
                val.name,
                val.value,
                clearPreviousValue
            );
        });
    },

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

    submitWithAverageNote() {
        cy.get(this.elements.submitCommentable).click();
        cy.get(this.elements.snackbar);
        cy.get(this.elements.body).click(); // dismiss notification
        cy.wait(200); // let the notification disappear (could block further submits)
    },

    gotoTab(index) {
        cy.get(this.elements.tab(index)).click();
    },
});
