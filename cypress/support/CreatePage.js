export default url => ({
    elements: {
        addAuthor: '.button-add-authors',
        body: 'body',
        bodyInput: '.ra-input-body .ql-editor',
        input: (name, type = 'input') => `.create-page ${type}[name='${name}']`,
        inputs: `.ra-input`,
        snackbar: 'div[role="alertdialog"]',
        submitButton: ".create-page div[role='toolbar'] button[type='submit']",
        submitAndShowButton:
            ".create-page form div[role='toolbar'] button[type='button']:nth-child(2)",
        submitAndAddButton:
            ".create-page form div[role='toolbar'] button[type='button']:nth-child(3)",
        submitCommentable:
            ".create-page form div[role='toolbar'] button[type='button']:last-child",
        descInput: '.ql-editor',
        tab: index => `.form-tab:nth-of-type(${index})`,
        title: '#react-admin-title',
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

    submitAndShow() {
        cy.get(this.elements.submitAndShowButton).click();
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
