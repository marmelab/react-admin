import assert from 'assert';
import { until } from 'selenium-webdriver';
import driver from '../chromeDriver';

import createPageFactory from '../pages/CreatePage';
import editPageFactory from '../pages/EditPage';
import listPageFactory from '../pages/ListPage';
import loginPageFactory from '../pages/LoginPage';
import showPageFactory from '../pages/ShowPage';

describe('Permissions', () => {
    const CreatePage = createPageFactory(
        'http://localhost:8083/#/users/create'
    )(driver);
    const EditPage = editPageFactory('http://localhost:8083/#/users/1')(driver);
    const ListPage = listPageFactory('http://localhost:8083/#/users')(driver);
    const LoginPage = loginPageFactory('http://localhost:8083/#/login')(driver);
    const ShowPage = showPageFactory(
        'http://localhost:8083/#/users/1/show',
        'name'
    )(driver);

    describe('Resources', () => {
        it('hides protected resources depending on permissions', async () => {
            await LoginPage.navigate();
            await LoginPage.login('login', 'password');

            assert.deepEqual(await ListPage.getResources(), [
                'Posts',
                'Comments',
                'Logout',
            ]);
        });

        it('shows protected resources depending on permissions', async () => {
            await LoginPage.navigate();
            await LoginPage.login('user', 'password');

            assert.deepEqual(await ListPage.getResources(), [
                'Posts',
                'Comments',
                'Users',
                'Logout',
            ]);
        });
    });

    describe('hides protected data depending on permissions', () => {
        before(async () => {
            await LoginPage.navigate();
            await LoginPage.login('user', 'password');
            await driver.wait(until.urlIs('http://localhost:8083/#/posts'));
        });

        it('in List page with DataGrid', async () => {
            await ListPage.navigate();

            assert.deepEqual(await ListPage.getColumns(), [
                'ID',
                'NAME',
                '',
                '',
            ]);
        });

        it('in List page filters', async () => {
            await ListPage.navigate();

            assert.deepEqual(await ListPage.getAvailableFilters(), ['Name']);
        });

        it('in Create page', async () => {
            await CreatePage.navigate();

            assert.deepEqual(await CreatePage.getFields(), ['name']);
        });

        it('in Show page', async () => {
            await ShowPage.navigate();

            assert.deepEqual(await ShowPage.getFields(), ['id', 'name']);
        });

        it('in Edit page', async () => {
            await EditPage.navigate();

            assert.deepEqual(await EditPage.getFields(), ['name']);
            assert.deepEqual(await EditPage.getTabs(), ['SUMMARY']);
        });
    });

    describe('shows protected data depending on permissions', () => {
        before(async () => {
            await LoginPage.navigate();
            await LoginPage.login('admin', 'password');
            await driver.wait(until.urlIs('http://localhost:8083/#/posts'));
        });

        it('in List page with DataGrid', async () => {
            await ListPage.navigate();

            assert.deepEqual(await ListPage.getColumns(), [
                'ID',
                'NAME',
                'ROLE',
                '',
                '',
            ]);
        });

        it('in List page filters', async () => {
            await ListPage.navigate();

            assert.deepEqual(await ListPage.getAvailableFilters(), [
                'Name',
                'Role',
            ]);
        });

        it('in Create page', async () => {
            await CreatePage.navigate();

            assert.deepEqual(await CreatePage.getFields(), ['name', 'role']);
        });

        it('in Show page', async () => {
            await ShowPage.navigate();

            assert.deepEqual(await ShowPage.getFields(), [
                'id',
                'name',
                'role',
            ]);
        });

        it('in Edit page', async () => {
            await EditPage.navigate();

            assert.deepEqual(await EditPage.getFields(), [
                'id',
                'name',
                'role',
            ]);
            assert.deepEqual(await EditPage.getTabs(), ['SUMMARY', 'SECURITY']);
        });
    });
});
