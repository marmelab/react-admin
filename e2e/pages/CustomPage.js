import { By, until } from 'selenium-webdriver';

export default url => driver => ({
    elements: {
        appLoader: By.css('.app-loader'),
        total: By.css('.total'),
        bodyFromLayout: By.css('.body'),
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

    hasBody() {
        return driver
            .findElements(this.elements.bodyFromLayout)
            .then(elements => elements.length > 0);
    },

    getTotal() {
        return driver
            .findElement(this.elements.total)
            .then(element => element.getText());
    },
});
