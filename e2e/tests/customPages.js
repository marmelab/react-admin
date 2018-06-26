import assert from 'assert';
import driver from '../chromeDriver';
import customPageFactory from '../pages/CustomPage';

describe('Custom Pages', () => {
    const CustomPageNoLayout = customPageFactory(
        'http://localhost:8083/#/custom'
    )(driver);

    const CustomPageWithLayout = customPageFactory(
        'http://localhost:8083/#/custom2'
    )(driver);

    describe('Without Layout', () => {
        before(async () => await CustomPageNoLayout.navigate());

        it('should not display the layout', async () => {
            assert.equal(await CustomPageNoLayout.hasBody(), false);
        });

        it('should have retrieved the number of posts', async () => {
            assert.equal(await CustomPageNoLayout.getTotal(), '13');
        });
    });
    describe('With Layout', () => {
        before(async () => await CustomPageWithLayout.navigate());

        it('should display the layout', async () => {
            assert.equal(await CustomPageWithLayout.hasBody(), true);
        });

        it('should have retrieved the number of posts', async () => {
            assert.equal(await CustomPageWithLayout.getTotal(), '13');
        });
    });
});
