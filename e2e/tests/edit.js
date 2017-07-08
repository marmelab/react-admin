import assert from 'assert';
import driver from '../chromeDriver';
import editPageFactory from '../pages/EditPage';

describe('Edit Page', () => {
    const EditPage = editPageFactory('http://localhost:8083/#/posts/5')(driver);

    beforeEach(async () => await EditPage.navigate());

    describe('TabbedForm', () => {
        it('should display the title in a TextField', async () => {
            assert.equal(
                await EditPage.getInputValue('title'),
                'Sed quo et et fugiat modi'
            );
        });

        it('should allow to update elements', async () => {
            await EditPage.setInputValue('title', 'Lorem Ipsum');
            await EditPage.submit();
            await EditPage.navigate();
            assert.equal(await EditPage.getInputValue('title'), 'Lorem Ipsum');
            await driver.sleep(3000);
        });

        it('should redirect to list page after edit success', async () => {
            await EditPage.setInputValue('title', 'Lorem Ipsum +');
            await EditPage.submit();
            assert.equal(
                await driver.getCurrentUrl(),
                'http://localhost:8083/#/posts'
            );
            await EditPage.navigate();
        });

        it('should allow to switch tabs', async () => {
            await EditPage.gotoTab(2);
            assert.equal(await EditPage.getInputValue('average_note'), '3');
        });

        it('should keep DateInput value after opening datapicker', async () => {
            await EditPage.gotoTab(3);
            const valueBeforeClick = await EditPage.getInputValue(
                'published_at'
            );
            await EditPage.clickInput('published_at');
            assert.equal(
                await EditPage.getInputValue('published_at'),
                valueBeforeClick
            );
        });
    });
});
