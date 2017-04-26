import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import createPageFactory from '../pages/CreatePage';
import deletePageFactory from '../pages/DeletePage';
import showPageFactory from '../pages/ShowPage';

describe('Show Page', () => {
    const CreatePage = createPageFactory('http://localhost:8083/#posts/create')(driver);
    const DeletePage = deletePageFactory('http://localhost:8083/#posts/14/delete')(driver);
    const ShowPage = showPageFactory('http://localhost:8083/#posts/14/show')(driver);

    beforeEach(async () => await CreatePage.navigate());
    async function deleteNewPost(){
        await DeletePage.navigate();
        await DeletePage.delete();
    }

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
        await deleteNewPost();
    });
});
