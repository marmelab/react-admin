const assert = require('assert');
const webdriver = require('selenium-webdriver');
const driver = require('../chromeDriver');
const ListPageFactory = require('../pages/ListPage');

const until = webdriver.until;

describe('List Page', () => {
    const ListPage = ListPageFactory('posts')(driver);

    beforeEach(function* () {
        yield ListPage.navigate();
    });

    describe('Pagination', () => {
        it('should display paginated list of available posts', function* () {
            const displayedRecords = yield driver.findElement(ListPage.elements.displayedRecords);
            assert.equal(yield displayedRecords.getText(), '1-10 of 12');
        });

        it('should switch page when clicking on previous/next page buttons or page numbers', function* () {
            const displayedRecords = yield driver.findElement(ListPage.elements.displayedRecords);

            yield ListPage.nextPage();
            assert.equal(yield displayedRecords.getText(), '11-12 of 12');

            yield ListPage.previousPage();
            assert.equal(yield displayedRecords.getText(), '1-10 of 12');

            yield ListPage.goToPage(2);
            assert.equal(yield displayedRecords.getText(), '11-12 of 12');

            yield ListPage.goToPage(1);
            assert.equal(yield displayedRecords.getText(), '1-10 of 12');
        });
    });

    describe.only('Filtering', () => {
        it('should display by default `alwaysOn` filters', function* () {
            yield driver.wait(until.elementLocated(ListPage.elements.filter('q')));
        });

        it('should filter directly while typing (with some debounce)', function* () {
            yield ListPage.filter('q', 'quis culpa impedit');

            const displayedPosts = yield driver.findElements(ListPage.elements.recordRows);
            assert.equal(displayedPosts.length, 1);

            const title = yield displayedPosts[0].findElement(webdriver.By.css('[data-source="title"]'));
            assert.equal(yield title.getText(), 'Omnis voluptate enim similique est possimus');
        });

        it('should display new filter when clicking on "Add Filter"', function* () {
            yield ListPage.showFilter('title');
            const filters = yield driver.findElements(ListPage.elements.filter('title'));
            assert.equal(filters.length, 1);
        });

        it('should hide filter field when clicking on hiding button', function* () {
            // yield driver.wait(() => {});
            yield ListPage.showFilter('title');
            yield ListPage.hideFilter('title');

            const filters = yield driver.findElements(ListPage.elements.filter('title'));
            assert.equal(filters.length, 0);
        });
    });

    after(() => {
        ListPage.close();
    });
});
