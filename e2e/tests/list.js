const assert = require('assert');
const webdriver = require('selenium-webdriver');
const driver = require('../chromeDriver');
const ListPageFactory = require('../pages/ListPage');

describe('List Page', () => {
    const ListPage = ListPageFactory('posts')(driver);

    beforeEach(function* () {
        yield ListPage.navigate();
    });

    it('should display paginated list of available posts', function* () {
        const displayedRecords = yield driver.findElement(webdriver.By.css('.displayed-records'));
        assert.equal(yield displayedRecords.getText(), '1-10 of 12');
    });

    it('should switch page when clicking on previous/next page buttons or page numbers', function* () {
        const displayedRecords = yield driver.findElement(webdriver.By.css('.displayed-records'));

        yield ListPage.nextPage();
        assert.equal(yield displayedRecords.getText(), '11-12 of 12');

        yield ListPage.previousPage();
        assert.equal(yield displayedRecords.getText(), '1-10 of 12');

        yield ListPage.goToPage(2);
        assert.equal(yield displayedRecords.getText(), '11-12 of 12');

        yield ListPage.goToPage(1);
        assert.equal(yield displayedRecords.getText(), '1-10 of 12');
    });

    after(() => {
        ListPage.close();
    });
});
