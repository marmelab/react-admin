import assert from 'assert';
import { until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import createPageFactory from '../pages/CustomFormPage';
import showPageFactory from '../pages/ShowPage';

describe('Custom Forms', () => {
    const CreatePage = createPageFactory(
        'http://localhost:8083/#/comments/create'
    )(driver);

    const ShowPage = showPageFactory('http://localhost:8083/#/posts/14/show')(
        driver
    );

    beforeEach(async () => await CreatePage.navigate());

    it('should allows to preview the selected post', async () => {
        await driver.wait(until.elementLocated(CreatePage.elements.postSelect));
        await driver.findElement(CreatePage.elements.postSelect).click();
        await driver.wait(
            until.elementLocated(CreatePage.elements.postItem(12))
        );
        await driver.sleep(250); // wait for the dropdown animation

        const postItem = driver.findElement(CreatePage.elements.postItem(12));
        await postItem.click();
        await driver.wait(until.stalenessOf(postItem));
        await CreatePage.waitUntilDataLoaded();

        await driver.wait(
            until.elementLocated(CreatePage.elements.showPostPreviewModalButton)
        );
        await driver
            .findElement(CreatePage.elements.showPostPreviewModalButton)
            .click();
        await driver.wait(
            until.elementLocated(CreatePage.elements.modalCloseButton)
        );

        assert.equal(await ShowPage.getValue('id'), '12');

        assert.equal(
            await ShowPage.getValue('title'),
            'Qui tempore rerum et voluptates'
        );
        assert.equal(
            await ShowPage.getValue('teaser'),
            'Occaecati rem perferendis dolor aut numquam cupiditate. At tenetur dolores pariatur et libero asperiores porro voluptas. Officiis corporis sed eos repellendus perferendis distinctio hic consequatur.'
        );

        const modalCloseButton = await driver.findElement(
            CreatePage.elements.modalCloseButton
        );

        modalCloseButton.click();
        await driver.wait(until.stalenessOf(modalCloseButton));
    });

    it('should allows to create a new post', async () => {
        await driver.wait(
            until.elementLocated(CreatePage.elements.showPostCreateModalButton)
        );
        await driver
            .findElement(CreatePage.elements.showPostCreateModalButton)
            .click();

        await driver.wait(
            until.elementLocated(CreatePage.elements.postCreateModal)
        );

        await CreatePage.setInputValue('input', 'title', 'Bazinga!');
        await CreatePage.setInputValue('textarea', 'teaser', 'Bazingaaaaaaaa!');
        await driver.findElement(CreatePage.elements.modalSubmitButton).click();
        await CreatePage.waitUntilDataLoaded();
        const title = await driver
            .findElement(CreatePage.elements.postSelect)
            .getText();

        assert.equal(title, 'Bazinga!');
        await ShowPage.navigate();
        await ShowPage.delete();
    });
});
