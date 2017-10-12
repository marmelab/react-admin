import assert from 'assert';
import { routerReducer } from 'react-router-redux';
import { initialState as admin } from './admin/index.spec';
import { initialState as notificationInitialState } from './admin/notification';
import { initialState as resourceInitialState } from './admin/resource/index.spec';
import { initialState as dataInitialState } from './admin/resource/data';
import { DEFAULT_LOCALE } from '../i18n/index';
import createReducer, * as selectors from './index';
import { declareResources } from '../actions';

export const initialState = {
    admin,
    locale: DEFAULT_LOCALE,
    form: {},
    routing: routerReducer(undefined, {}),
};

describe('root reducer', () => {
    it('should return initial state by default', () => {
        assert.deepEqual(initialState, createReducer()(undefined, {}));
    });
});

describe('root selectors', () => {
    const resource = { name: 'posts' };
    const state = createReducer()(undefined, declareResources([resource]));
    const expectedResourceState = {
        ...resourceInitialState,
        props: resource,
    };

    describe('getAdmin', () => {
        it('should return admin state slice ', () => {
            assert.deepEqual(selectors.getAdmin(state), {
                ...admin,
                resources: { posts: expectedResourceState },
            });
        });
    });

    describe('getAdminResource', () => {
        it('should return a single resource', () => {
            assert.deepEqual(
                selectors.getAdminResource(state, { resource: 'posts' }),
                expectedResourceState
            );
        });
    });

    describe('getAdminResourceData', () => {
        it('should return the data state slice of the given resource', () => {
            assert.deepEqual(
                selectors.getAdminResourceData(state, { resource: 'posts' }),
                dataInitialState
            );
        });
    });

    describe('getAdminResourceRecord', () => {
        it('should return a single record of the given resource', () => {
            assert.equal(
                selectors.getAdminResourceRecord(state, {
                    resource: 'posts',
                    id: 1,
                }),
                undefined
            );
        });
    });

    describe('getAdminResourceRecordsByIds', () => {
        it('should return a map of records of the given resource', () => {
            assert.deepEqual(
                selectors.getAdminResourceRecordsByIds(state, {
                    resource: 'posts',
                    ids: [1, 2],
                }),
                {}
            );
        });
    });

    describe('isAdminLoading', () => {
        it('should return loading state default value', () => {
            assert.deepEqual(selectors.isAdminLoading(state), false);
        });
    });

    describe('isAdminSaving', () => {
        it('should return saving state default value', () => {
            assert.deepEqual(selectors.isAdminSaving(state), false);
        });
    });

    describe('getPossibleReferences', () => {
        it('should return a list of possible references', () => {
            const getPossibleReferences = selectors.makeGetAdminPossibleReferences();
            assert.deepEqual(
                getPossibleReferences(state, {
                    references: 'referenceSource',
                    resource: 'posts',
                    ids: [1, 2],
                }),
                {}
            );
        });
    });

    describe('getIdsRelatedTo', () => {
        it('should return a list of ids related to given record', () => {
            assert.deepEqual(
                selectors.getIdsRelatedTo(state, { relatedTo: 'relatedTo' }),
                []
            );
        });
    });

    describe('getLocale', () => {
        it('should return the default locale by default', () => {
            assert.deepEqual(selectors.getLocale(state), DEFAULT_LOCALE);
        });
    });

    describe('getAdminNotification', () => {
        it('should return an notification initial state by default', () => {
            assert.deepEqual(
                selectors.getAdminNotification(state),
                notificationInitialState
            );
        });
    });

    describe('isSidebarOpen', () => {
        it('should return default sidebar state by default', () => {
            assert.deepEqual(selectors.isSidebarOpen(state), false);
        });
    });

    describe('isSidebarOpen', () => {
        it('should return the admin UI view version', () => {
            assert.deepEqual(selectors.getViewVersion(state), 0);
        });
    });
});
