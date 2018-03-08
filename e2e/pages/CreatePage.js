import { By, until } from 'selenium-webdriver';

export default url => driver => ({
    elements: {
        appLoader: By.css('.app-loader'),
        body: By.css('body'),
        input: (name, type = 'input') =>
            By.css(`.create-page ${type}[name='${name}']`),
        inputs: By.css(`.ra-input`),
        snackbar: By.css('div[role="alertdialog"]'),
        submitButton: By.css(".create-page button[type='submit']"),
        submitAndAddButton: By.css(
            ".create-page form>div:last-child button[type='button']"
        ),
        descInput: By.css('.ql-editor'),
    },

    navigate() {
        driver.navigate().to(url);
        return this.waitUntilDataLoaded();
    },

    waitUntilVisible() {
        return driver.wait(until.elementLocated(this.elements.submitButton));
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
        const input = driver.findElement(this.elements.input(type, name));
        if (clearPreviousValue) {
            input.clear();
        }
        return input.sendKeys(value);
    },

    setValues(values, clearPreviousValue = true) {
        let input;
        let lastPromise;
        values.forEach(val => {
            input = driver.findElement(this.elements.input(val.name, val.type));
            if (clearPreviousValue) {
                input.clear();
            }
            lastPromise = input.sendKeys(val.value);
        });
        return lastPromise;
    },

    getInputValue(name, type = 'input') {
        return driver
            .findElement(this.elements.input(name, type))
            .getAttribute('value');
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

    submit() {
        return driver
            .findElement(this.elements.submitButton)
            .click()
            .then(() =>
                driver.wait(until.elementLocated(this.elements.snackbar), 3000)
            )
            .then(() => driver.findElement(this.elements.body).click()) // dismiss notification
            .then(() => driver.sleep(200)) // let the notification disappear (could block further submits)
            .then(() => this.waitUntilDataLoaded());
    },

    submitAndAdd() {
        return driver
            .findElement(this.elements.submitAndAddButton)
            .click()
            .then(() =>
                driver.wait(until.elementLocated(this.elements.snackbar), 3000)
            )
            .then(() => driver.findElement(this.elements.body).click()) // dismiss notification
            .then(() => driver.sleep(200)) // let the notification disappear (could block further submits)
            .then(() => this.waitUntilDataLoaded());
    },
});
