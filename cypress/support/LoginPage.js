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
        cy.get(this.elements.username).type(username);
        cy.get(this.elements.password).type(password);
        cy.get(this.elements.submitButton).click();
    },
});
