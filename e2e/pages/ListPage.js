const webdriver = require('selenium-webdriver');

const by = webdriver.By;
const until = webdriver.until;

module.exports = (entity) => (driver) => ({
    elements: {
        displayedRecords: by.css('.displayed-records'),
        recordRows: by.css('.datagrid-body tr'),
        nextPage: by.css('.next-page'),
        previousPage: by.css('.previous-page'),
        pageNumber: n => by.css(`.page-number[data-page='${n}']`),
    },

    waitUntilVisible() {
        return driver.wait(until.elementLocated(this.elements.recordRows));
    },

    navigate() {
        driver.navigate().to(`http://localhost:8081/#/${entity}`);
        return this.waitUntilVisible();
    },

    nextPage() {
        return driver.findElement(this.elements.nextPage).click();
    },

    previousPage() {
        return driver.findElement(this.elements.previousPage).click();
    },

    goToPage(n) {
        return driver.findElement(this.elements.pageNumber(n)).click();
    },

    close() {
        driver.quit();
    },
});
