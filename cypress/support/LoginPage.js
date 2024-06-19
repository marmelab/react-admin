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
        // cy.wait(500);
        cy.get(this.elements.username).clear().type(username);
        cy.get(this.elements.password).clear().type(password);
        cy.get(this.elements.submitButton).click();
    },
});
