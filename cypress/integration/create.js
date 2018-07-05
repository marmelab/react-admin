import createPageFactory from '../support/CreatePage';
import showPageFactory from '../support/ShowPage';

describe('Create Page', () => {
    const CreatePage = createPageFactory('/#/posts/create');
    const ShowPage = showPageFactory('/#/posts/14/show');

    beforeEach(() => CreatePage.navigate());

    it('should put the current date in the field by default', () => {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().slice(0, 10);
        cy.get(CreatePage.elements.input('published_at')).should(el =>
            expect(el).to.have.value(currentDateString)
        );
    });

    it('should redirect to show page after create success', () => {
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
        cy.get(CreatePage.elements.input('title')).should(el =>
            expect(el).to.have.value('')
        ); // new empty form

        ShowPage.navigate();
        ShowPage.delete();
    });

    it('should not reset form values when an input with defaultValue is dynamically added', () => {
        const values = [
            {
                type: 'input',
                name: 'title',
                value: 'Test title',
            },
        ];
        CreatePage.setValues(values);

        cy.get(CreatePage.elements.input('average_note')).should(el =>
            expect(el).to.have.value('3')
        );
        cy.get(CreatePage.elements.input('title')).should(el =>
            expect(el).to.have.value('Test title')
        );
    });

    it('should not accept creation without required fields', () => {
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
