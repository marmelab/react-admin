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

    before(async () => {
        await ListPagePosts.navigate();
    });

    describe('Pagination', () => {
        it('should display paginated list of available posts', async () => {
            // 14 because we created one in custom-forms tests
            assert.equal(await ListPagePosts.getNbPagesText(), '1-10 of 14');
        });

        it('should switch page when clicking on previous/next page buttons or page numbers', async () => {
            await ListPagePosts.nextPage();
            // 14 because we created one in custom-forms tests
            assert.equal(await ListPagePosts.getNbPagesText(), '11-14 of 14');

            await ListPagePosts.previousPage();
            // 14 because we created one in custom-forms tests
            assert.equal(await ListPagePosts.getNbPagesText(), '1-10 of 14');

            await ListPagePosts.goToPage(2);
            // 14 because we created one in custom-forms tests
            assert.equal(await ListPagePosts.getNbPagesText(), '11-14 of 14');
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

            await ListPagePosts.setFilterValue('q', '');
        });

        it('should display new filter when clicking on "Add Filter"', async () => {
            await ListPagePosts.showFilter('title');

            const filters = await driver.findElements(
                ListPagePosts.elements.filter('title')
            );

            assert.equal(filters.length, 1);
            assert.equal(await ListPagePosts.getNbPagesText(), '1-1 of 1');

            await ListPagePosts.hideFilter('title');
        });

        it('should hide filter when clicking on hide button', async () => {
            await ListPagePosts.showFilter('title');
            await ListPagePosts.hideFilter('title');

            const filters = await driver.findElements(
                ListPagePosts.elements.filter('title')
            );
            assert.equal(filters.length, 0);
            assert.equal(await ListPagePosts.getNbPagesText(), '1-10 of 14');
        });

        it('should keep filters when navigating away and going back on given page', async () => {
            await ListPagePosts.setFilterValue('q', 'quis culpa impedit');

            await ListPageComments.navigate();
            await ListPagePosts.navigate();

            const filterValue = await ListPagePosts.getFilterValue('q');
            assert.equal(filterValue, 'quis culpa impedit');
            assert.equal(await ListPagePosts.getNbPagesText(), '1-1 of 1');

            await ListPagePosts.setFilterValue('q', '');
        });
    });

    describe('Bulk Actions', () => {
        it('should allow to select all items on the current page', async () => {
            await ListPagePosts.toggleSelectAll();
            assert.equal(await ListPagePosts.getSelectedItemsCount(), 10);
            await ListPagePosts.toggleSelectAll();
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
            await ListPagePosts.toggleSelectAll();
            await ListPagePosts.applyUpdateBulkAction();
            assert.equal(await ListPagePosts.getSelectedItemsCount(), 0);
        });

        it('should allow to select multiple items on the current page', async () => {
            await ListPagePosts.toggleSelectSomeItems(3);
            assert.equal(await ListPagePosts.getSelectedItemsCount(), 3);

            await ListPagePosts.toggleSelectAll();
            await ListPagePosts.toggleSelectAll();
        });

        it('should allow to trigger the delete bulk action on selected items', async () => {
            await ListPagePosts.toggleSelectSomeItems(3);
            await ListPagePosts.applyDeleteBulkAction();
            assert.equal(await ListPagePosts.getNbPagesText(), '1-10 of 11');
        });
    });
});
