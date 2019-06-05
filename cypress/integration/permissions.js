import createPageFactory from '../support/CreatePage';
import editPageFactory from '../support/EditPage';
import listPageFactory from '../support/ListPage';
import loginPageFactory from '../support/LoginPage';
import showPageFactory from '../support/ShowPage';

describe('Permissions', () => {
    const CreatePage = createPageFactory('/#/users/create');
    const EditPage = editPageFactory('/#/users/1');
    const ListPage = listPageFactory('/#/users');
    const LoginPage = loginPageFactory('/#/login');
    const ShowPage = showPageFactory('/#/users/1/show', 'name');

    describe('Resources', () => {
        it('hides protected resources depending on permissions', () => {
            LoginPage.navigate();
            LoginPage.login('login', 'password');
            cy.contains('Posts');
            cy.contains('Comments');
            cy.contains('Users').should(el => expect(el).to.not.exist);
        });

        it('shows protected resources depending on permissions', () => {
            LoginPage.navigate();
            LoginPage.login('user', 'password');
            cy.contains('Posts');
            cy.contains('Comments');
            cy.contains('Users');
        });
    });

    describe('hides protected data depending on permissions', () => {
        beforeEach(() => {
            LoginPage.navigate();
            LoginPage.login('user', 'password');
            cy.url().then(url => expect(url).to.contain('/#/posts'));
        });

        it('in List page with DataGrid', () => {
            ListPage.navigate();
            cy.contains('Id');
            cy.contains('Name');
            cy.contains('Role').should(el => expect(el).to.not.exist);
        });

        it('in List page filters', () => {
            ListPage.navigate();
            ListPage.openFilters();
            cy.get(ListPage.elements.filterMenuItem('name')).should(el => expect(el).to.exist);
            cy.get(ListPage.elements.filter('role')).should(el => expect(el).to.not.exist);
        });

        it('in Create page', () => {
            CreatePage.navigate();
            cy.contains('Name');
            cy.contains('Role').should(el => expect(el).to.not.exist);
        });

        it('in Show page', () => {
            ShowPage.navigate();
            cy.contains('Id');
            cy.contains('Name');
            cy.contains('Role').should(el => expect(el).to.not.exist);
            cy.contains('Summary');
            cy.contains('Security').should(el => expect(el).to.not.exist);
        });

        it('in Edit page', () => {
            EditPage.navigate();
            cy.contains('Name');
            cy.contains('Summary');
            cy.contains('Security').should(el => expect(el).to.not.exist);
        });
    });

    describe('shows protected data depending on permissions', () => {
        beforeEach(() => {
            LoginPage.navigate();
            LoginPage.login('admin', 'password');
            cy.url().then(url => expect(url).to.contain('/#/posts'));
        });

        it('in List page with DataGrid', () => {
            ListPage.navigate();
            cy.contains('Id');
            cy.contains('Name');
            cy.contains('Role');
        });

        it('in List page filters', () => {
            ListPage.navigate();
            ListPage.openFilters();
            cy.get(ListPage.elements.filterMenuItem('name')).should(el => expect(el).to.exist);
            cy.get(ListPage.elements.filter('role')).should(el => expect(el).to.exist);
        });

        it('in Create page', () => {
            CreatePage.navigate();
            cy.contains('Name');
            cy.contains('Role');
        });

        it('in Show page', () => {
            ShowPage.navigate();
            cy.contains('Id');
            cy.contains('Name');
            cy.contains('Summary');
            cy.contains('Security');
            ShowPage.gotoTab(2);
            cy.contains('Role');
        });

        it('in Edit page', () => {
            EditPage.navigate();
            cy.contains('Name');
            cy.contains('Summary');
            cy.contains('Security');
            EditPage.gotoTab(1);
            cy.contains('Role');
        });
    });
});
