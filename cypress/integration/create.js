import createPageFactory from '../support/CreatePage';
import editPageFactory from '../support/EditPage';
import showPageFactory from '../support/ShowPage';
import loginPageFactory from '../support/LoginPage';

describe('Create Page', () => {
    const CreatePage = createPageFactory('/#/posts/create');
    const UserCreatePage = createPageFactory('/#/users/create');
    const ShowPage = showPageFactory('/#/posts/14/show');
    const EditPage = editPageFactory('/#/posts/14');
    const LoginPage = loginPageFactory('/#/login');

    beforeEach(() => {
        LoginPage.navigate();
        LoginPage.login('admin', 'password');
        CreatePage.navigate();
    });

    it('should show the correct title in the appBar', () => {
        cy.get(CreatePage.elements.title).contains('Create Post');
    });

    it('should put the current date in the field by default', () => {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().slice(0, 10);
        cy.get(CreatePage.elements.input('published_at')).should(el =>
            expect(el).to.have.value(currentDateString)
        );
    });

    it('should put the ArrayInput default value', () => {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().slice(0, 10);
        cy.get(CreatePage.elements.input('backlinks[0].date')).should(el =>
            expect(el).to.have.value(currentDateString)
        );
        cy.get(CreatePage.elements.input('backlinks[0].url')).should(el =>
            expect(el).to.have.value('http://google.com')
        );
    });

    it('should have a working array input with references', () => {
        cy.get(CreatePage.elements.addAuthor).click();
        cy.get(CreatePage.elements.input('authors[0].user_id')).should(
            el => expect(el).to.exist
        );
        cy.get(CreatePage.elements.input('authors[0].role')).should(
            el => expect(el).to.not.exist
        );
    });

    it('should have a working array input with a scoped FormDataConsumer', () => {
        cy.get(CreatePage.elements.addAuthor).click();
        CreatePage.setValues([
            {
                type: 'input',
                name: 'authors[0].user_id',
                value: 'Annamarie Mayer',
            },
        ]);
        cy.contains('Annamarie Mayer').click();
        cy.get(CreatePage.elements.input('authors[0].role')).should(
            el => expect(el).to.exist
        );
    });

    it('should redirect to edit page after create success', () => {
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
            {
                type: 'rich-text-input',
                name: 'body',
                value: 'Test body',
            },
        ];

        CreatePage.setValues(values);
        CreatePage.submit();
        EditPage.waitUntilVisible();
        cy.get(EditPage.elements.input('title')).should(el =>
            expect(el).to.have.value('Test title')
        );
        cy.get(EditPage.elements.input('teaser')).should(el =>
            expect(el).to.have.value('Test teaser')
        );

        EditPage.delete();
    });

    it('should redirect to show page after create success with "Save and show"', () => {
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
            {
                type: 'rich-text-input',
                name: 'body',
                value: 'Test body',
            },
        ];

        CreatePage.setValues(values);
        CreatePage.submitAndShow();
        ShowPage.waitUntilVisible();
        EditPage.navigate();
        EditPage.delete();
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
            {
                type: 'rich-text-input',
                name: 'body',
                value: 'Test body',
            },
        ];
        CreatePage.setValues(values);
        CreatePage.submitAndAdd();
        cy.url().then(url => expect(url).to.contain('/#/posts/create'));
        cy.get(CreatePage.elements.input('title')).should(el =>
            expect(el).to.have.value('')
        ); // new empty form

        EditPage.navigate();
        EditPage.delete();
    });

    it('should allow to call a custom action updating values before submit', () => {
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
            {
                type: 'checkbox',
                name: 'commentable',
                value: false,
            },
            {
                type: 'rich-text-input',
                name: 'body',
                value: 'Test body',
            },
        ];

        CreatePage.setValues(values);
        CreatePage.submitWithAverageNote();
        ShowPage.waitUntilVisible();
        ShowPage.gotoTab(3);
        cy.contains('10');
        EditPage.navigate();
        EditPage.delete();
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
            expect(el).to.have.value('5')
        );
        cy.get(CreatePage.elements.input('title')).should(el =>
            expect(el).to.have.value('Test title')
        );
    });

    it('should not reset the form value when switching tabs', () => {
        LoginPage.navigate();
        LoginPage.login('admin', 'password');
        UserCreatePage.navigate();

        CreatePage.setValues([
            {
                type: 'input',
                name: 'name',
                value: 'The real Slim Shady!',
            },
        ]);
        CreatePage.gotoTab(2);
        CreatePage.gotoTab(1);
        cy.get(CreatePage.elements.input('name')).should(el =>
            expect(el).to.have.value('The real Slim Shady!')
        );
    });

    it('should not show rich text input error message when field is untouched', () => {
        cy.get('.ra-rich-text-input > p').should('not.exist');
    });

    it('should show rich text input error message when form is submitted', () => {
        CreatePage.submit();
        cy.get('.ra-rich-text-input > p').should('exist').contains('Required');
    });

    it('should not show rich text input error message when form is submitted and input is filled with text', () => {
        CreatePage.submit();
        cy.get('.ra-rich-text-input > p').should('exist').contains('Required');
        cy.get(CreatePage.elements.input('body', 'rich-text-input')).type('text');
        cy.get('.ra-rich-text-input > p').should('not.exist');
    });

    it('should show body in edit view after creating new post', () => {
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
            {
                type: 'rich-text-input',
                name: 'body',
                value: 'Test body',
            },
        ];

        CreatePage.setValues(values);
        CreatePage.submit();
        EditPage.gotoTab(2);
        cy.get(EditPage.elements.input('body', 'rich-text-input')).contains('Test body');
    });
});
