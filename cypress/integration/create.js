import createPageFactory from '../support/CreatePage';
import showPageFactory from '../support/ShowPage';

describe('Create Page', () => {
    const CreatePage = createPageFactory('/#/posts/create');
    const ShowPage = showPageFactory('/#/posts/14/show');

    it('should put the current date in the field by default', () => {
        CreatePage.navigate();
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().slice(0, 10);
        cy
            .get(CreatePage.elements.input('published_at'))
            .should(el => expect(el).to.have.value(currentDateString));
    });

    it('should redirect to show page after create success', () => {
        CreatePage.navigate();
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

        CreatePage.setValues(values);
        CreatePage.submit();
        ShowPage.waitUntilVisible();
        ShowPage.delete();
    });

    it('should stay at create page after create success with "Save and add"', () => {
        CreatePage.navigate();
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
        CreatePage.setValues(values);
        CreatePage.submitAndAdd();
        cy.url().then(url => expect(url).to.contain('/#/posts/create'));
        cy
            .get(CreatePage.elements.input('title'))
            .should(el => expect(el).to.have.value('')); // new empty form

        ShowPage.navigate();
        ShowPage.delete();
    });

    it('should not accept creation without required fields', () => {
        CreatePage.navigate();
        const values = [
            {
                type: 'textarea',
                name: 'teaser',
                value: 'Test teaser',
            },
        ];
        CreatePage.setValues(values);
        CreatePage.submit();
        cy.contains('Required field');
    });
});
