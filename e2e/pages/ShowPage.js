import { By, until } from 'selenium-webdriver';

export default (url, initialField = 'title') => driver => ({
    elements: {
        appLoader: By.css('.app-loader'),
        body: By.css('body'),
        deleteButton: By.css('.ra-delete-button'),
        deleteConfirmButton: By.css('.ra-confirm'),
        field: name => By.css(`.ra-field-${name} > div > div > span`),
        fields: By.css(`.ra-field`),
        snackbar: By.css('div[role="alertdialog"]'),
        tabs: By.css(`.show-tab`),
        tab: index => By.css(`button.show-tab:nth-of-type(${index})`),
    },

    navigate() {
        driver.navigate().to(url);
        return this.waitUntilDataLoaded();
    },

    waitUntilVisible() {
        return driver.wait(
            until.elementLocated(this.elements.field(initialField))
        );
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

    getValue(name) {
        return driver.findElement(this.elements.field(name)).getText();
    },

    getFields() {
        return driver.findElements(this.elements.fields).then(fields =>
            Promise.all(
                fields.map(field =>
                    field.getAttribute('class').then(classes =>
                        classes
                            .split(' ')
                            .filter(className =>
                                className.startsWith('ra-field-')
                            )[0]
                            .replace('ra-field-', '')
                    )
                )
            )
        );
    },

    getTabs() {
        return driver
            .findElements(this.elements.tabs)
            .then(tabs => Promise.all(tabs.map(tab => tab.getText())));
    },

    gotoTab(index) {
        const tab = driver.findElement(this.elements.tab(index));
        tab.click();
        return driver.sleep(200);
    },

    async delete() {
        const deleteButton = await driver.findElement(
            this.elements.deleteButton
        );
        await deleteButton.click();

        const deleteConfirmationButton = await driver.findElement(
            this.elements.deleteConfirmButton
        );
        await deleteConfirmationButton.click();

        await this.waitUntilDataLoaded();
    },
});
