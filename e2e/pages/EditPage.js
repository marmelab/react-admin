import { By, until } from 'selenium-webdriver';

export default url => driver => ({
    elements: {
        appLoader: By.css('.app-loader'),
        input: name => By.css(`.edit-page input[name='${name}']`),
        inputs: By.css(`.ra-input`),
        tabs: By.css(`.form-tab`),
        submitButton: By.css(".edit-page button[type='submit']"),
        tab: index => By.css(`button.form-tab:nth-of-type(${index})`),
        title: By.css('.title'),
    },

    navigate() {
        driver.navigate().to(url);
        return this.waitUntilDataLoaded();
    },

    waitUntilVisible() {
        return driver.wait(until.elementLocated(this.elements.title));
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

    getInputValue(name) {
        const input = driver.findElement(this.elements.input(name));
        return input.getAttribute('value');
    },

    getFields() {
        return driver.findElements(this.elements.inputs).then(fields =>
            Promise.all(
                fields.map(field =>
                    field.getAttribute('class').then(classes =>
                        classes
                            .split(' ')
                            .filter(className =>
                                className.startsWith('ra-input-')
                            )[0]
                            .replace('ra-input-', '')
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

    setInputValue(name, value, clearPreviousValue = true) {
        const input = driver.findElement(this.elements.input(name));
        if (clearPreviousValue) {
            input.clear();
        }
        return input.sendKeys(value);
    },

    async getInputValue(name) {
        const input = await driver.findElement(this.elements.input(name));
        return await input.getAttribute('value');
    },

    clickInput(name) {
        const input = driver.findElement(this.elements.input(name));
        input.click();
        return driver.sleep(200);
    },

    gotoTab(index) {
        const tab = driver.findElement(this.elements.tab(index));
        tab.click();
        return driver.sleep(200);
    },

    submit() {
        driver.findElement(this.elements.submitButton).click();
        return this.waitUntilDataLoaded();
    },
});
