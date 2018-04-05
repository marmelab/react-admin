import assert from 'assert';
import driver from '../chromeDriver';
import showPageFactory from '../pages/ShowPage';

describe('Show Page', () => {
    const ShowPage = showPageFactory('http://localhost:8083/#/posts/13/show')(
        driver
    );

    beforeEach(async () => await ShowPage.navigate());

    it('should fill the page with data from the fetched record', async () => {
        await ShowPage.navigate();
        assert.equal(
            await ShowPage.getValue('title'),
            'Fusce massa lorem, pulvinar a posuere ut, accumsan ac nisi'
        );
    });
});
