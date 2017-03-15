import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import listPageFactory from '../pages/ListPage';

describe('List Page', () => {
    const ListPage = listPageFactory('http://localhost:8083/#posts')(driver);

    beforeEach(async () => await ListPage.navigate());

    describe('Pagination', () => {
        it('should display paginated list of available posts', async () => {
            assert.equal(await ListPage.getNbPagesText(), '1-10 of 13');
        });

        it('should switch page when clicking on previous/next page buttons or page numbers', async () => {
            await ListPage.nextPage();
            assert.equal(await ListPage.getNbPagesText(), '11-13 of 13');

            await ListPage.previousPage();
            assert.equal(await ListPage.getNbPagesText(), '1-10 of 13');

            await ListPage.goToPage(2);
            assert.equal(await ListPage.getNbPagesText(), '11-13 of 13');
        });
    });

    describe('Filtering', () => {
        it('should display `alwaysOn` filters by default', async () => {
            await driver.wait(until.elementLocated(ListPage.elements.filter('q')));

            const qFilter = await driver.findElements(ListPage.elements.filter('q'));
            assert.equal(qFilter.length, 1);
        });

        it('should filter directly while typing (with some debounce)', async () => {
            await ListPage.setFilterValue('q', 'quis culpa impedit');
            assert.equal(await ListPage.getNbRows(), 1);
            const displayedPosts = await driver.findElements(ListPage.elements.recordRows);
            const title = await displayedPosts[0].findElement(By.css('.column-title'));
            assert.equal(await title.getText(), 'Omnis voluptate enim similique est possimus');
        });

        it('should display new filter when clicking on "Add Filter"', async () => {
            await ListPage.showFilter('title');
            const filters = await driver.findElements(ListPage.elements.filter('title'));
            assert.equal(filters.length, 1);
        });

        it('should hide filter when clicking on hide button', async () => {
            await ListPage.hideFilter('title');
            const filters = await driver.findElements(ListPage.elements.filter('title'));
            assert.equal(filters.length, 0);
        });
    });
});
