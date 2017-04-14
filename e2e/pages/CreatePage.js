import { By, until } from 'selenium-webdriver';

module.exports = (url) => (driver) => ({
    elements: {
        appLoader: By.css('.app-loader'),
        input: (type, name) => By.css(`.create-page ${type}[name='${name}']`),
        submitButton: By.css(".create-page button[type='submit']"),
        descInput: By.css(".ql-editor"),
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
        return driver.wait(until.elementLocated(this.elements.appLoader), 400)
            .catch(() => continued = false) // no loader - we're on the same page !
            .then(() => continued ? driver.wait(until.stalenessOf(driver.findElement(this.elements.appLoader))) : true)
            .then(() => driver.sleep(100)); // let some time to redraw
    },

    setInputValue(type, name, value, clearPreviousValue = true) {
        const input = driver.findElement(this.elements.input(type, name));
        if (clearPreviousValue) {
            input.clear();
        }
        return input.sendKeys(value);
    },

    setValues(values, descValue, clearPreviousValue = true){
        let input;
        values.forEach((val) => {
            input = driver.findElement(this.elements.input(val.type, val.name));
            if(clearPreviousValue)
                input.clear();
            input.sendKeys(val.value);
        });
        return this.setDescValue(descValue);
    },

    setDescValue(value, clearPreviousValue = true) {
        const input = driver.findElement(this.elements.descInput);
        if(clearPreviousValue)
            input.clear();
        return input.sendKeys(value);
    },

    getInputValue(type, name){
        return driver.findElement(this.elements.input(type, name)).getAttribute('value');
    },

    submit() {
        driver.findElement(this.elements.submitButton).click();
        return this.waitUntilDataLoaded();
    },
});
