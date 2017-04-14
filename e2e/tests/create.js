import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import createPageFactory from '../pages/CreatePage';
import deletePageFactory from '../pages/DeletePage';
import showPageFactory from '../pages/ShowPage';

describe('Create Page', () => {
    const CreatePage = createPageFactory('http://localhost:8083/#posts/create')(driver);
    const DeletePage = deletePageFactory('http://localhost:8083/#posts/14/delete')(driver);
    const ShowPage = showPageFactory('http://localhost:8083/#posts/14/show')(driver);

    beforeEach(async () => await CreatePage.navigate());
    afterEach(async () => {
        await DeletePage.navigate();
        await DeletePage.delete();
    });

    it('should put the current date in the field by default', async () => {
        await CreatePage.navigate();
        const currentDate = new Date();
        let day = formatNumber(currentDate.getDate());
        let month = formatNumber(currentDate.getMonth()+1);
        let year = currentDate.getFullYear();
        const currentDateString = year + '-' + month + '-' + day;
        assert.equal(await CreatePage.getInputValue('input','published_at'), currentDateString);
    });

    it('should redirect to created post', async () => {
        const values = [
            {
                type: 'input',
                name: 'title',
                value: 'Test title',
            },
            {
                type: 'textarea',
                name: 'teaser',
                value: 'Test teaser',
            }
        ];
        await CreatePage.setValues(values, 'Lorem Ipsum');
        await CreatePage.submit();
        assert.equal(await driver.getCurrentUrl(), 'http://localhost:8083/#/posts/14');
    });

    it('should give good title to show page', async() => {
        const values = [
            {
                type: 'input',
                name: 'title',
                value: 'Test title',
            },
            {
                type: 'textarea',
                name: 'teaser',
                value: 'Test teaser',
            }
        ];
        await CreatePage.setValues(values, 'Lorem Ipsum');
        await CreatePage.submit();
        await ShowPage.navigate();
        assert.equal(await ShowPage.getValue('title'), 'Test title');
    });
});

/**
 * function which add a 0 before a number < 0.
 * It uses for write a date at YYYY-MM-DD format 
 */
function formatNumber(number) {
    if(number<10)
        number = "0"+number;
    return number;
}
