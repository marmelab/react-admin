import { By, until } from 'selenium-webdriver';

export default url => driver => ({
    elements: {
        appLoader: By.css('.app-loader'),
        body: By.css('body'),
        input: (name, type = 'input') => By.css(`${type}[name='${name}']`),
        modalCloseButton: By.css("[data-testid='button-close-modal']"),
        modalSubmitButton: By.css(
            "[data-testid='dialog-add-post'] button[type='submit']"
        ),
        submitAndAddButton: By.css(
            ".create-page form>div:last-child button[type='button']"
        ),
        postSelect: By.css('.ra-input-post_id [role="button"]'),
        postItem: id => By.css(`li[data-value="${id}"]`),
        showPostCreateModalButton: By.css('[data-testid="button-add-post"]'),
        showPostPreviewModalButton: By.css('[data-testid="button-show-post"]'),
        postCreateModal: By.css('[data-testid="dialog-add-post"]'),
        postPreviewModal: By.css('[data-testid="dialog-show-post"]'),
    },

    navigate() {
        driver.navigate().to(url);
        return this.waitUntilDataLoaded();
    },

    waitUntilDataLoaded() {
        let continued = true;
        return driver
            .wait(until.elementLocated(this.elements.appLoader), 2000)
            .catch(() => (continued = false)) // no loader - we're on the same page !
            .then(
                () =>
                    continued
                        ? driver.wait(
                              until.stalenessOf(
                                  driver.findElement(this.elements.appLoader)
                              )
                          )
                        : true
            )
            .catch(() => {}) // The element might have disapeared before the wait on the previous line
            .then(() => driver.sleep(100)); // let some time to redraw
    },

    setInputValue(type, name, value, clearPreviousValue = true) {
        const input = driver.findElement(this.elements.input(name, type));
        if (clearPreviousValue) {
            input.clear();
        }
        return input.sendKeys(value);
    },
});
