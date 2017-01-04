import { By, until } from 'selenium-webdriver';

module.exports = (entity) => (driver) => ({
    elements: {
        addFilterButton: By.css('.add-filter'),
        appLoader: By.css('app-loader'),
        displayedRecords: By.css('.displayed-records'),
        filter: name => By.css(`.filter-field[data-source='${name}']`),
        filterMenuItem: source => By.css(`.new-filter-item[data-key="${source}"]`),
        hideFilterButton: source => By.css(`.filter-field[data-source="${source}"] .hide-filter`),
        nextPage: By.css('.next-page'),
        pageNumber: n => By.css(`.page-number[data-page='${n}']`),
        previousPage: By.css('.previous-page'),
        recordRows: By.css('.datagrid-body tr'),
    },

    waitUntilVisible() {
        return driver.wait(until.elementLocated(this.elements.recordRows));
    },

    waitEndOfLoading() {
        // @FIXME: find a less empiric method
        return driver.sleep(1000);
    },

    navigate() {
        driver.navigate().to(`http://localhost:8083/#/${entity}`);
        return this.waitUntilVisible();
    },

    nextPage() {
        driver.findElement(this.elements.nextPage).click();
        return this.waitEndOfLoading();
    },

    previousPage() {
        driver.findElement(this.elements.previousPage).click();
        return this.waitEndOfLoading();
    },

    goToPage(n) {
        driver.findElement(this.elements.pageNumber(n)).click();
        return this.waitEndOfLoading();
    },

    filter(name, value) {
        const filterField = driver.findElement(this.elements.filter(name));
        filterField.findElement(By.css('input')).sendKeys(value);
        return driver.sleep(3000); // wait for debounce and reload
    },

    showFilter(name) {
        const addFilterButton = driver.findElement(this.elements.addFilterButton);
        addFilterButton.click();
        driver.wait(until.elementLocated(this.elements.filterMenuItem(name)));
        return driver.findElement(this.elements.filterMenuItem(name)).click();
    },

    hideFilter(name) {
        const hideFilterButton = driver.findElement(this.elements.hideFilterButton(name));
        return hideFilterButton.click();
    },

    close() {
        driver.quit();
    },
});
