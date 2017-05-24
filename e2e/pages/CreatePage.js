import { By, until } from 'selenium-webdriver';

module.exports = url => driver => ({
    elements: {
        appLoader: By.css('.app-loader'),
        input: (name, type = 'input') => By.css(`.create-page ${type}[name='${name}']`),
        submitButton: By.css(".create-page button[type='submit']"),
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
        return driver.wait(until.elementLocated(this.elements.appLoader), 2000)
            .catch(() => continued = false) // no loader - we're on the same page !
            .then(() => continued ? driver.wait(until.stalenessOf(driver.findElement(this.elements.appLoader))) : true)
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
        values.forEach((val) => {
            input = driver.findElement(this.elements.input(val.name, val.type));
            if (clearPreviousValue) {
                input.clear();
            }
            lastPromise = input.sendKeys(val.value);
        });
        return lastPromise;
    },

    getInputValue(name, type = 'input') {
        return driver.findElement(this.elements.input(name, type)).getAttribute('value');
    },

    submit() {
        driver.findElement(this.elements.submitButton).click();
        return this.waitUntilDataLoaded();
    },
});
