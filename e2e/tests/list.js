import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import listPageFactory from '../pages/ListPage';

describe('List Page', () => {
    const ListPagePosts = listPageFactory('http://localhost:8083/#/posts')(
        driver
    );
    const ListPageComments = listPageFactory(
        'http://localhost:8083/#/comments'
    )(driver);

    beforeEach(async () => {
        await ListPagePosts.navigate();
    });

    describe('Pagination', () => {
        it('should display paginated list of available posts', async () => {
            assert.equal(await ListPagePosts.getNbPagesText(), '1-10 of 13');
        });

        it('should switch page when clicking on previous/next page buttons or page numbers', async () => {
            await ListPagePosts.nextPage();
            assert.equal(await ListPagePosts.getNbPagesText(), '11-13 of 13');

            await ListPagePosts.previousPage();
            assert.equal(await ListPagePosts.getNbPagesText(), '1-10 of 13');

            await ListPagePosts.goToPage(2);
            assert.equal(await ListPagePosts.getNbPagesText(), '11-13 of 13');
        });
    });

    describe('Filtering', () => {
        it('should display `alwaysOn` filters by default', async () => {
            await driver.wait(
                until.elementLocated(ListPagePosts.elements.filter('q'))
            );

            const qFilter = await driver.findElements(
                ListPagePosts.elements.filter('q')
            );
            assert.equal(qFilter.length, 1);
        });

        it('should filter directly while typing (with some debounce)', async () => {
            await ListPagePosts.setFilterValue('q', 'quis culpa impedit');
            assert.equal(await ListPagePosts.getNbRows(), 1);
            const displayedPosts = await driver.findElements(
                ListPagePosts.elements.recordRows
            );
            const title = await displayedPosts[0].findElement(
                By.css('.column-title')
            );

            assert.equal(
                await title.getText(),
                'Omnis voluptate enim similique est possimus'
            );
        });

        it('should display new filter when clicking on "Add Filter"', async () => {
            await ListPagePosts.showFilter('title');

            const filters = await driver.findElements(
                ListPagePosts.elements.filter('title')
            );

            assert.equal(filters.length, 1);
            assert.equal(await ListPagePosts.getNbPagesText(), '1-1 of 1');
        });

        it('should hide filter when clicking on hide button', async () => {
            await ListPagePosts.hideFilter('title');
            const filters = await driver.findElements(
                ListPagePosts.elements.filter('title')
            );
            assert.equal(filters.length, 0);
            assert.equal(await ListPagePosts.getNbPagesText(), '1-10 of 13');
        });

        it('should keep filters when navigating away and going back on given page', async () => {
            await ListPagePosts.setFilterValue('q', 'quis culpa impedit');

            await ListPageComments.navigate();
            await ListPagePosts.navigate();

            const filterValue = await ListPagePosts.getFilterValue('q');
            assert.equal(filterValue, 'quis culpa impedit');
            assert.equal(await ListPagePosts.getNbPagesText(), '1-1 of 1');
        });
    });

    describe('Bulk Actions', () => {
        it('should allow to select all items on the current page', async () => {
            await ListPagePosts.toggleSelectAll();
            assert.equal(await ListPagePosts.getSelectedItemsCount(), 10);
        });

        it('should allow to unselect all items on the current page', async () => {
            await ListPagePosts.toggleSelectAll();
            await ListPagePosts.toggleSelectAll();
            assert.equal(await ListPagePosts.getSelectedItemsCount(), 0);
        });

        it('should allow to trigger a custom bulk action on selected items', async () => {
            await ListPagePosts.toggleSelectAll();
            await ListPagePosts.applyUpdateBulkAction();
            assert.deepEqual(await ListPagePosts.getViewsColumnValues(), [
                '0',
                '0',
                '0',
                '0',
                '0',
                '0',
                '0',
                '0',
                '0',
                '0',
            ]);
        });

        it('should have unselected all items after bulk action', async () => {
            assert.equal(await ListPagePosts.getSelectedItemsCount(), 0);
        });

        it('should allow to select multiple items on the current page', async () => {
            await ListPagePosts.toggleSelectSomeItems(3);
            assert.equal(await ListPagePosts.getSelectedItemsCount(), 3);
        });

        it('should allow to trigger the delete bulk action on selected items', async () => {
            await ListPagePosts.toggleSelectSomeItems(3);
            await ListPagePosts.applyDeleteBulkAction();
            assert.equal(await ListPagePosts.getNbPagesText(), '1-10 of 10');
        });
    });

    afterEach(async () => {
        await ListPagePosts.setFilterValue('q', '');
    });
});
