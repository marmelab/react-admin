import assert from 'assert';
import { until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import createPageFactory from '../pages/CreatePage';
import deletePageFactory from '../pages/DeletePage';

describe('Create Page', () => {
    const CreatePage = createPageFactory(
        'http://localhost:8083/#/posts/create'
    )(driver);
    const DeletePage = deletePageFactory(
        'http://localhost:8083/#/posts/14/delete'
    )(driver);

    beforeEach(async () => await CreatePage.navigate());

    it('should put the current date in the field by default', async () => {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().slice(0, 10);
        assert.equal(
            await CreatePage.getInputValue('published_at'),
            currentDateString
        );
    });

    it('should redirect to show page after create success', async () => {
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
            },
        ];
        await CreatePage.setValues(values);
        await CreatePage.submit();
        await driver.wait(until.urlIs('http://localhost:8083/#/posts/14/show'));
        await DeletePage.navigate();
        await DeletePage.delete();
        await driver.sleep(3000); // let the notification for deletion disappear (could block further submits)
    });

    it('should stay at create page after create success with "Save and add"', async () => {
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
            },
        ];
        await CreatePage.setValues(values);
        await CreatePage.submitAndAdd();
        await driver.wait(until.urlIs('http://localhost:8083/#/posts/create'));
        assert.equal(await CreatePage.getInputValue('title'), ''); // new empty form
        await DeletePage.navigate();
        await DeletePage.delete();
        await driver.sleep(3000); // let the notification for deletion disappear (could block further submits)
    });

    it('should not accept creation without required fields', async () => {
        const values = [
            {
                type: 'textarea',
                name: 'teaser',
                value: 'Test teaser',
            },
        ];
        await CreatePage.setValues(values);
        await CreatePage.submit();
    });
});
