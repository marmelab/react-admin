import assert from 'assert';
import webdriver from 'selenium-webdriver';
import driver from '../chromeDriver';
import listPageFactory from '../pages/ListPage';

const until = webdriver.until;

describe('List Page', () => {
    const ListPage = listPageFactory('posts')(driver);

    beforeEach(async () => await ListPage.navigate());

    describe('Pagination', () => {
        it('should display paginated list of available posts', async () => {
            const displayedRecords = await driver.findElement(ListPage.elements.displayedRecords);
            assert.equal(await displayedRecords.getText(), '1-10 of 12');
        });

        it('should switch page when clicking on previous/next page buttons or page numbers', async () => {
            const displayedRecords = await driver.findElement(ListPage.elements.displayedRecords);

            await ListPage.nextPage();
            assert.equal(await displayedRecords.getText(), '11-12 of 12');

            await ListPage.previousPage();
            assert.equal(await displayedRecords.getText(), '1-10 of 12');

            await ListPage.goToPage(2);
            assert.equal(await displayedRecords.getText(), '11-12 of 12');

            await ListPage.goToPage(1);
            assert.equal(await displayedRecords.getText(), '1-10 of 12');
        });
    });

    describe('Filtering', () => {
        it('should display `alwaysOn` filters by default', async () => {
            await driver.wait(until.elementLocated(ListPage.elements.filter('q')));

            const qFilter = await driver.findElements(ListPage.elements.filter('q'));
            assert.equal(qFilter.length, 1);
        });

        it('should filter directly while typing (with some debounce)', async () => {
            await ListPage.filter('q', 'quis culpa impedit');

            const displayedPosts = await driver.findElements(ListPage.elements.recordRows);
            assert.equal(displayedPosts.length, 1);

            const title = await displayedPosts[0].findElement(webdriver.By.css('.column-title'));
            assert.equal(await title.getText(), 'Omnis voluptate enim similique est possimus');
        });

        it('should display new filter when clicking on "Add Filter"', async () => {
            await ListPage.showFilter('title');
            const filters = await driver.findElements(ListPage.elements.filter('title'));
            assert.equal(filters.length, 1);
        });

        it('should hide filter field when clicking on hiding button', async () => {
            // @FIXME: filters are persisted even when reloading URL without query params
            await ListPage.hideFilter('title');

            await ListPage.showFilter('title');
            await ListPage.hideFilter('title');

            const filters = await driver.findElements(ListPage.elements.filter('title'));
            assert.equal(filters.length, 0);
        });
    });

    after(() => ListPage.close());
});
