import { By, until } from 'selenium-webdriver';

export default (url, initialField = 'title') => driver => ({
    elements: {
        appLoader: By.css('.app-loader'),
        field: name => By.css(`.aor-field-${name} > div > span`),
        fields: By.css(`.aor-field`),
    },

    navigate() {
        driver.navigate().to(url);
        return this.waitUntilVisible();
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
                            .replace('aor-field-', '')
                            .replace('aor-field', '')
                            .trim()
                    )
                )
            )
        );
    },
});
