import { By, until } from 'selenium-webdriver';

module.exports = url => driver => ({
    elements: {
        appLoader: By.css('.app-loader'),
        input: name => By.css(`.edit-page input[name='${name}']`),
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
        return driver.wait(until.elementLocated(this.elements.appLoader), 2000)
            .catch(() => continued = false) // no loader - we're on the same page !
            .then(() => continued ? driver.wait(until.stalenessOf(driver.findElement(this.elements.appLoader))) : true)
            .then(() => driver.sleep(100)); // let some time to redraw
    },

    getInputValue(name) {
        const input = driver.findElement(this.elements.input(name));
        return input.getAttribute('value');
    },

    setInputValue(name, value, clearPreviousValue = true) {
        const input = driver.findElement(this.elements.input(name));
        if (clearPreviousValue) {
            input.clear();
        }
        return input.sendKeys(value);
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
