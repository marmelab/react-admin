export default url => ({
    elements: {
        appLoader: '.app-loader',
        username: "input[name='username']",
        password: "input[name='password']",
        submitButton: 'button',
        title: '#react-admin-title',
    },

    navigate() {
        cy.visit(url);
        this.waitUntilVisible();
    },

    waitUntilVisible() {
        cy.get(this.elements.username);
    },

    login(username = 'login', password = 'password', shouldFail = false) {
        cy.get(this.elements.username).clear().type(username);
        cy.get(this.elements.password).clear().type(password);
        cy.get(this.elements.submitButton).click();
        if (!shouldFail) {
            cy.get(this.elements.title);
            cy.get(this.elements.appLoader);
        }
    },
});
