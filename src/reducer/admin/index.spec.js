import assert from 'assert';
import resourceReducer from './resource';
import { initialState as notification } from './notification';
import { initialState as record } from './record';
import { initialState as references } from './references/index.spec';
import { initialState as ui } from './ui';
import { initialState as resourceInitialState } from './resource/index.spec';
import { initialState as dataInitialState } from './resource/data';
import reducer, * as adminSelectors from './index';

export const initialState = {
    resources: {},
    loading: 0,
    notification,
    record,
    references,
    saving: false,
    ui,
};

describe('admin reducer', () => {
    it('should return initial state by default', () => {
        assert.deepEqual(initialState, reducer(undefined, {}));
    });
});

describe('admin selectors', () => {
    const resource = { name: 'posts' };
    const state = {
        ...initialState,
        resources: {
            posts: resourceReducer(resource)(undefined, {}),
        },
    };
    const expectedResourceState = {
        ...resourceInitialState,
        props: resource,
    };

    describe('getResources', () => {
        it('should return resources state slice ', () => {
            assert.deepEqual(adminSelectors.getResources(state), {
                posts: expectedResourceState,
            });
        });
    });

    describe('getResource', () => {
        it('should return a single resource from the resources state slice', () => {
            assert.deepEqual(
                adminSelectors.getResource(state, { resource: 'posts' }),
                expectedResourceState
            );
        });
    });

    describe('getResourceData', () => {
        it('should return the data state slice of the given resource', () => {
            assert.deepEqual(
                adminSelectors.getResourceData(state, { resource: 'posts' }),
                dataInitialState
            );
        });
    });

    describe('getResourceRecord', () => {
        it('should return a single record of the given resource', () => {
            assert.deepEqual(
                adminSelectors.getResourceRecord(state, {
                    resource: 'posts',
                    id: 1,
                }),
                undefined
            );
        });
    });

    describe('getResourceRecordsByIds', () => {
        it('should return a map of records of the given resource', () => {
            assert.deepEqual(
                adminSelectors.getResourceRecordsByIds(state, {
                    resource: 'posts',
                    ids: [1, 2],
                }),
                {}
            );
        });
    });

    describe('isLoading', () => {
        it('should return the default loading state of the admin by default', () => {
            assert.deepEqual(adminSelectors.isLoading(state), false);
        });
    });

    describe('getNotification', () => {
        it('should return an notification initial state by default', () => {
            assert.deepEqual(
                adminSelectors.getNotification(state),
                notification
            );
        });
    });

    describe('getReferences', () => {
        it('should return references state slice', () => {
            assert.deepEqual(adminSelectors.getReferences(state), references);
        });
    });

    describe('getReferencePossibleValues', () => {
        it('should return an array of possible values for the given reference', () => {
            assert.deepEqual(
                adminSelectors.getReferencePossibleValues(state, {
                    reference: 'reference',
                }),
                []
            );
        });
    });

    describe('isSaving', () => {
        it('should return saving state default value', () => {
            assert.deepEqual(adminSelectors.isSaving(state), false);
        });
    });

    describe('getUI', () => {
        it('should return UI state slice', () => {
            assert.deepEqual(adminSelectors.getUI(state), ui);
        });
    });

    describe('isSidebarOpen', () => {
        it('should return default sidebar state by default', () => {
            assert.deepEqual(adminSelectors.isUISidebarOpen(state), false);
        });
    });

    describe('isUISidebarOpen', () => {
        it('should return the UI view version', () => {
            assert.deepEqual(adminSelectors.getUIViewVersion(state), 0);
        });
    });

    describe('getPossibleReferences', () => {
        it('should return a list of possible references', () => {
            const getPossibleReferences = adminSelectors.makeGetPossibleReferences();
            assert.deepEqual(
                getPossibleReferences(state, {
                    reference: 'referenceSource',
                    resource: 'posts',
                    ids: [1, 2],
                }),
                {}
            );
        });
    });

    describe('getReferencesIdsRelatedTo', () => {
        it('should return the list of ids related to', () => {
            assert.deepEqual(
                adminSelectors.getReferencesIdsRelatedTo(state, {
                    relatedTo: 'relatedTo',
                }),
                []
            );
        });
    });
});
