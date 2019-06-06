export default url => ({
    elements: {
        appLoader: '.app-loader',
        body: 'body',
        input: (name, type = 'input') => `${type}[name='${name}']`,
        modalCloseButton: "[data-testid='button-close-modal']",
        modalSubmitButton:
            "[data-testid='dialog-add-post'] button[type='submit']",
        submitAndAddButton:
            ".create-page form>div:last-child button[type='button']",
        postSelect: '.ra-input-post_id [role="button"]',
        postItem: id => `li[data-value="${id}"]`,
        showPostCreateModalButton: '[data-testid="button-add-post"]',
        showPostPreviewModalButton: '[data-testid="button-show-post"]',
        postCreateModal: '[data-testid="dialog-add-post"]',
        postPreviewModal: '[data-testid="dialog-show-post"]',
    },

    navigate() {
        cy.visit(url);
    },

    setInputValue(type, name, value, clearPreviousValue = true) {
        if (clearPreviousValue) {
            cy.get(this.elements.input(name, type)).clear();
        }
        cy.get(this.elements.input(name, type)).type(value);
    },
});
