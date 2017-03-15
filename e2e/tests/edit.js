import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import editPageFactory from '../pages/EditPage';

describe('Edit Page', () => {
    const EditPage = editPageFactory('http://localhost:8083/#posts/5')(driver);

    beforeEach(async () => await EditPage.navigate());

    describe('TabbedForm', () => {
        it('should display the title in a TextField', async () => {
            const titleField = await driver.findElement(EditPage.elements.input('title'));
            assert.equal(await titleField.getAttribute('value'), 'Sed quo et et fugiat modi');
        });
    });
});
