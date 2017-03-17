import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import editPageFactory from '../pages/EditPage';

describe('Edit Page', () => {
    const EditPage = editPageFactory('http://localhost:8083/#posts/5')(driver);

    beforeEach(async () => await EditPage.navigate());

    describe('TabbedForm', () => {
        it('should display the title in a TextField', async () => {
            assert.equal(await EditPage.getInputValue('title'), 'Sed quo et et fugiat modi');
        });

        it('should allow to update elements', async () => {
            await EditPage.setInputValue('title', 'Lorem Ipsum');
            await EditPage.submit();
            await EditPage.navigate();
            assert.equal(await EditPage.getInputValue('title'), 'Lorem Ipsum');
        });

        it('should allow to switch tabs', async () => {
            await EditPage.gotoTab(2);
            assert.equal(await EditPage.getInputValue('average_note'), '3');
        })
    });
});
