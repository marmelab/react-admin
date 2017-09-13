import { By, until } from 'selenium-webdriver';

export default url => driver => ({
    elements: {
        appLoader: By.css('.app-loader'),
        input: (name, type = 'input') =>
            By.css(`.create-page ${type}[name='${name}']`),
        inputs: By.css(`.aor-input`),
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
                            .replace('aor-input-', '')
                            .replace('aor-input', '')
                            .trim()
                    )
                )
            )
        );
    },

    submit() {
        driver.findElement(this.elements.submitButton).click();
        return this.waitUntilDataLoaded();
    },

    submitAndAdd() {
        driver.findElement(this.elements.submitAndAddButton).click();
        return this.waitUntilDataLoaded();
    },
});
