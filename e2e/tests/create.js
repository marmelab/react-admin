import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import createPageFactory from '../pages/CreatePage';

describe('Create Page', () => {
    const CreatePage = createPageFactory('http://localhost:8083/#posts/create')(driver);

    beforeEach(async () => await CreatePage.navigate());

    it('should redirect to created post', async () => {
        await CreatePage.setTitleValue('title', 'Test title');
        await CreatePage.setTeaserValue('teaser', 'Test teaser');
        await CreatePage.setDescValue('Lorem Ipsum');
        await CreatePage.submit();
        assert.equal(await driver.getCurrentUrl(), 'http://localhost:8083/#/posts/14');
    });
});
