import assert from 'assert';
import driver from '../chromeDriver';
import showPageFactory from '../pages/ShowPage';

describe('Show Page', () => {
    const ShowPage = showPageFactory('http://localhost:8083/#/posts/10/show')(
        driver
    );

    beforeEach(async () => await ShowPage.navigate());

    it('should fill the page with data from the fetched record', async () => {
        await ShowPage.navigate();
        assert.equal(
            await ShowPage.getValue('title'),
            'Totam vel quasi a odio et nihil'
        );
    });
});
