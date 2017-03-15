import { By, until } from 'selenium-webdriver';

module.exports = (url) => (driver) => ({
    elements: {
        addFilterButton: By.css('.add-filter'),
        appLoader: By.css('.app-loader'),
        displayedRecords: By.css('.displayed-records'),
        filter: name => By.css(`.filter-field[data-source='${name}']`),
        filterMenuItem: source => By.css(`.new-filter-item[data-key="${source}"]`),
        hideFilterButton: source => By.css(`.filter-field[data-source="${source}"] .hide-filter`),
        nextPage: By.css('.next-page'),
        pageNumber: n => By.css(`.page-number[data-page='${n}']`),
        previousPage: By.css('.previous-page'),
        recordRows: By.css('.datagrid-body tr'),
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
        return driver.wait(until.elementLocated(this.elements.appLoader), 400)
            .catch(() => continued = false) // no loader - we're on the same page !
            .then(() => continued ? driver.wait(until.stalenessOf(driver.findElement(this.elements.appLoader))) : true)
            .then(() => driver.sleep(100)); // let some time to redraw
    },

    nextPage() {
        driver.findElement(this.elements.nextPage).click();
        return this.waitUntilDataLoaded();
    },

    previousPage() {
        driver.findElement(this.elements.previousPage).click();
        return this.waitUntilDataLoaded();
    },

    goToPage(n) {
        driver.findElement(this.elements.pageNumber(n)).click();
        return this.waitUntilDataLoaded();
    },

    filter(name, value) {
        const filterField = driver.findElement(this.elements.filter(name));
        filterField.findElement(By.css('input')).sendKeys(value);
        return driver.sleep(3000); // wait for debounce and reload
    },

    showFilter(name) {
        const addFilterButton = driver.findElement(this.elements.addFilterButton);
        addFilterButton.click();
        driver.sleep(500); // wait until the dropdown animation ends
        driver.wait(until.elementLocated(this.elements.filterMenuItem(name)));
        driver.findElement(this.elements.filterMenuItem(name)).click();
        return driver.sleep(400); // wait until the menu ClickAwayListener disappears
    },

    hideFilter(name) {
        const hideFilterButton = driver.findElement(this.elements.hideFilterButton(name));
        return hideFilterButton.click();
    },
});
