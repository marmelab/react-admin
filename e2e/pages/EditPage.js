import { By, until } from 'selenium-webdriver';

module.exports = (url) => (driver) => ({
    elements: {
        input: name => By.css(`.edit-page input[name='${name}']`),
        title: By.css('.title'),
        appLoader: By.css('.app-loader'),
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
        return driver.wait(until.elementLocated(this.elements.appLoader), 400)
            .catch(() => continued = false) // no loader - we're on the same page !
            .then(() => continued ? driver.wait(until.stalenessOf(driver.findElement(this.elements.appLoader))) : true)
            .then(() => driver.sleep(100)); // let some time to redraw
    },
});
