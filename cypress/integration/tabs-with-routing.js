import editPageFactory from '../support/EditPage';
import loginPageFactory from '../support/LoginPage';
import showPageFactory from '../support/ShowPage';

describe('Tabs with routing', () => {
    const EditPage = editPageFactory('#/users/1');
    const ShowPage = showPageFactory('#/users/1/show', 'name');
    const LoginPage = loginPageFactory('#/login');

    beforeEach(() => {
        LoginPage.navigate();
        LoginPage.login('admin', 'password');
        cy.url().then(url => expect(url).to.contain('#/posts'));
    });

    describe('in TabbedLayout component', () => {
        beforeEach(() => ShowPage.navigate());

        it('allows to switch tabs using the buttons', () => {
            cy.contains('Summary');
            cy.contains('Security');
            cy.contains('Id');
            cy.contains('Name');
            ShowPage.gotoTab(2);
            cy.url().then(url => expect(url).to.match(/.*#\/users\/1\/show\/security/));
            cy.contains('Role');
            ShowPage.gotoTab(1);
            cy.contains('Id');
            cy.contains('Name');
            cy.url().then(url => expect(url).to.match(/.*#\/users\/1\/show/));
        });

        it('allows to switch tabs using the browser history', () => {
            cy.contains('Id');
            cy.contains('Name');
            ShowPage.gotoTab(2);
            cy.url().then(url => expect(url).to.match(/.*#\/users\/1\/show\/security/));
            cy.contains('Role');
            cy.go('back');
            cy.contains('Id');
            cy.contains('Name');
            cy.url().then(url => expect(url).to.match(/.*#\/users\/1\/show/));
        });
    });

    describe('in TabbedForm component', () => {
        beforeEach(() => EditPage.navigate());
        it('allows to switch tabs using the buttons', () => {
            cy.contains('Summary');
            cy.contains('Security');
            cy.contains('Id');
            cy.contains('Name');
            EditPage.gotoTab(2);
            cy.url().then(url => expect(url).to.match(/.*#\/users\/1\/security/));
            cy.contains('Role');
            EditPage.gotoTab(1);
            cy.contains('Id');
            cy.contains('Name');
            cy.url().then(url => expect(url).to.match(/.*#\/users\/1/));
        });

        it('allows to switch tabs using the browser history', () => {
            cy.contains('Id');
            cy.contains('Name');
            EditPage.gotoTab(2);
            cy.url().then(url => expect(url).to.match(/.*#\/users\/1\/security/));
            cy.contains('Role');
            cy.go('back');
            cy.contains('Id');
            cy.contains('Name');
            cy.url().then(url => expect(url).to.match(/.*#\/users\/1/));
        });
    });
});
