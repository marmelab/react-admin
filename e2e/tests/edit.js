import assert from 'assert';
import driver from '../chromeDriver';
import editPageFactory from '../pages/EditPage';

describe('Edit Page', () => {
    const EditPostPage = editPageFactory('http://localhost:8083/#/posts/5')(
        driver
    );
    const EditCommentPage = editPageFactory(
        'http://localhost:8083/#/comments/5'
    )(driver);

    beforeEach(async () => await EditPostPage.navigate());

    describe('TabbedForm', () => {
        it('should display the title in a TextField', async () => {
            assert.equal(
                await EditPostPage.getInputValue('title'),
                'Sed quo et et fugiat modi'
            );
        });

        it('should allow to update elements', async () => {
            await EditPostPage.setInputValue('title', 'Lorem Ipsum');
            await EditPostPage.submit();
            await EditPostPage.navigate();
            assert.equal(
                await EditPostPage.getInputValue('title'),
                'Lorem Ipsum'
            );
            await driver.sleep(3000);
        });

        it('should redirect to list page after edit success', async () => {
            await EditPostPage.setInputValue('title', 'Lorem Ipsum +');
            await EditPostPage.submit();
            assert.equal(
                await driver.getCurrentUrl(),
                'http://localhost:8083/#/posts'
            );
            await EditPostPage.navigate();
        });

        it('should allow to switch tabs', async () => {
            await EditPostPage.gotoTab(3);
            assert.equal(await EditPostPage.getInputValue('average_note'), '3');
        });

        it('should keep DateInput value after opening datapicker', async () => {
            await EditPostPage.gotoTab(3);
            const valueBeforeClick = await EditPostPage.getInputValue(
                'published_at'
            );
            await EditPostPage.clickInput('published_at');
            assert.equal(
                await EditPostPage.getInputValue('published_at'),
                valueBeforeClick
            );
        });
    });

    it('should fill form correctly even when switching from one form type to another', async () => {
        await EditCommentPage.navigate();
        const author = await EditCommentPage.getInputValue('author.name');
        assert.equal(author, 'Edmond Schulist');

        await EditPostPage.navigate();
        const title = await EditPostPage.getInputValue('title');
        assert.equal(title, 'Sed quo et et fugiat modi');
    });
});
