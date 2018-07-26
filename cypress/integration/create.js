import createPageFactory from '../support/CreatePage';
import showPageFactory from '../support/ShowPage';
import loginPageFactory from '../support/LoginPage';

describe('Create Page', () => {
    const CreatePage = createPageFactory('/#/posts/create');
    const UserCreatePage = createPageFactory('/#/users/create');
    const ShowPage = showPageFactory('/#/posts/14/show');
    const LoginPage = loginPageFactory('/#/login');

    beforeEach(() => CreatePage.navigate());

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
        ];

        CreatePage.setValues(values);
        CreatePage.submitWithAverageNote();
        ShowPage.waitUntilVisible();
        ShowPage.gotoTab(3);
        cy.contains('10');
        ShowPage.delete();
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

    // NOTE: For some reason, this test fails in Cypress but works when testing manually...
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
        cy.wait(250);
        CreatePage.gotoTab(2);
        cy.wait(250);
        CreatePage.gotoTab(1);
        cy.wait(250);
        cy.get(CreatePage.elements.input('name')).should(el =>
            expect(el).to.have.value('The real Slim Shady!')
        );
    });
});
