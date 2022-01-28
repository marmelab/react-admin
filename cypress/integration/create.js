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
        CreatePage.navigate();
        CreatePage.waitUntilVisible();
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
        cy.get(CreatePage.elements.input('backlinks.0.date')).should(el =>
            expect(el).to.have.value(currentDateString)
        );
        cy.get(CreatePage.elements.input('backlinks.0.url')).should(el =>
            expect(el).to.have.value('http://google.com')
        );
    });

    it('should validate ArrayInput', () => {
        const backlinksContainer = cy
            .get(CreatePage.elements.input('backlinks.0.date'))
            .parents('.ra-input-backlinks');
        backlinksContainer.contains('Remove').click();
        CreatePage.setValues([
            {
                type: 'input',
                name: 'title',
                value: 'foo',
            },
            {
                type: 'textarea',
                name: 'teaser',
                value: 'foo',
            },
            {
                type: 'rich-text-input',
                name: 'body',
                value: 'foo',
            },
        ]);
        cy.get('.ra-input-backlinks').contains('Required');
    });

    it('should have a working array input with references', () => {
        CreatePage.logout();
        LoginPage.login('admin', 'password');
        CreatePage.navigate();
        CreatePage.waitUntilVisible();
        cy.get(CreatePage.elements.addAuthor).click();
        cy.get(CreatePage.elements.input('authors.0.user_id')).should(
            el => expect(el).to.exist
        );
        cy.get(CreatePage.elements.input('authors.0.role')).should(
            el => expect(el).to.not.exist
        );
    });

    it('should have a working array input with a scoped FormDataConsumer', () => {
        CreatePage.logout();
        LoginPage.login('admin', 'password');
        CreatePage.navigate();
        CreatePage.waitUntilVisible();
        cy.get(CreatePage.elements.addAuthor).click();
        CreatePage.setValues([
            {
                type: 'input',
                name: 'authors.0.user_id',
                value: 'Annamarie Mayer',
            },
        ]);
        cy.get('[role="option"]').trigger('click');
        cy.get(CreatePage.elements.input('authors.0.role')).should(
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

    it('should redirect to edit page after submit on enter', () => {
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
        CreatePage.submitWithKeyboard();
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
                value: 'false',
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
        CreatePage.submit(false);
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
            expect(el).to.have.value('0')
        );
        cy.get(CreatePage.elements.input('title')).should(el =>
            expect(el).to.have.value('Test title')
        );
    });

    it('should not reset the form value when switching tabs', () => {
        CreatePage.logout();
        LoginPage.login('admin', 'password');
        CreatePage.navigate();
        CreatePage.waitUntilVisible();
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
        cy.get(CreatePage.elements.richTextInputError).should('not.exist');
    });

    it('should show rich text input error message when form is submitted', () => {
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
        CreatePage.submit(false);
        cy.get(CreatePage.elements.richTextInputError)
            .should('exist')
            .contains('Required');
    });

    it('should not show rich text input error message when form is submitted and input is filled with text', () => {
        const values = [
            {
                type: 'input',
                name: 'title',
                value: 'Test title',
            },
        ];
        CreatePage.setValues(values);
        CreatePage.submit(false);
        cy.get(CreatePage.elements.richTextInputError)
            .should('exist')
            .contains('Required');

        // Quill take a little time to boot and Cypress is too fast which can leads to unstable tests
        // so we wait a bit before interacting with the rich-text-input
        cy.wait(250);
        cy.get(CreatePage.elements.input('body', 'rich-text-input'))
            .type('text')
            .blur();
        cy.get(CreatePage.elements.richTextInputError).should('not.exist');
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
        cy.get(EditPage.elements.input('body', 'rich-text-input')).contains(
            'Test body'
        );
    });
});
