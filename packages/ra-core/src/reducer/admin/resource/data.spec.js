import assert from 'assert';

import {
    CRUD_DELETE_OPTIMISTIC,
    CRUD_DELETE_MANY_OPTIMISTIC,
    CRUD_UPDATE_OPTIMISTIC,
    CRUD_UPDATE_MANY_OPTIMISTIC,
} from '../../../actions/dataActions';
import {
    DELETE,
    DELETE_MANY,
    UPDATE,
    UPDATE_MANY,
} from '../../../dataFetchActions';

import dataReducer, { addRecordsFactory } from './data';
import { FETCH_END } from '../../../actions/fetchActions';

describe('data addRecordsFactory', () => {
    it('should call getFetchedAt with newRecords ids and oldRecordFetchedAt and return records returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = {
            fetchedAt: 'previousFetchedAt',
        };
        const getFetchedAt = jest.fn().mockReturnValue({
            record1: 'date',
            record2: 'date',
        });

        const newState = addRecordsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
        });

        assert.deepEqual(getFetchedAt.mock.calls[0], [
            ['record1', 'record2'],
            'previousFetchedAt',
        ]);

        assert.deepEqual(newState.fetchedAt, {
            record1: 'date',
            record2: 'date',
        });
    });

    it('should discard record that do not have their ids returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = { record3: 'record3' };
        const getFetchedAt = jest.fn().mockReturnValue({
            record1: 'date',
            record2: 'date',
        });

        const newState = addRecordsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
        });
    });

    it('should keep record that have their ids returned by getFetchedAt', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = { record3: 'record3' };
        const getFetchedAt = jest.fn().mockReturnValue({
            record1: 'date',
            record2: 'date',
            record3: 'date',
        });

        const newState = addRecordsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
            record3: 'record3',
        });
    });

    it('should replace oldRecord by new record', () => {
        const newRecords = [{ id: 'record1' }, { id: 'record2' }];
        const oldRecords = { record1: 'old record 1' };
        const getFetchedAt = jest.fn().mockReturnValue({
            record1: 'date',
            record2: 'date',
        });

        const newState = addRecordsFactory(getFetchedAt)(
            newRecords,
            oldRecords
        );

        assert.deepEqual(newState, {
            record1: { id: 'record1' },
            record2: { id: 'record2' },
        });
    });
});

describe('Resources data reducer', () => {
    describe('CRUD_DELETE_OPTIMISTIC', () => {
        it('removes the deleted record', () => {
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            };

            assert.deepEqual(
                dataReducer(state, {
                    type: CRUD_DELETE_OPTIMISTIC,
                    payload: { id: 'record2' },
                    meta: { effect: DELETE, optimistic: true },
                }),
                {
                    record1: { id: 'record1', prop: 'value' },
                    record3: { id: 'record3', prop: 'value' },
                }
            );
        });
    });
    describe('CRUD_DELETE_MANY_OPTIMISTIC', () => {
        it('removes the deleted records', () => {
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            };

            assert.deepEqual(
                dataReducer(state, {
                    type: CRUD_DELETE_MANY_OPTIMISTIC,
                    payload: { ids: ['record3', 'record2'] },
                    meta: {
                        effect: DELETE_MANY,
                        optimistic: true,
                    },
                }),
                {
                    record1: { id: 'record1', prop: 'value' },
                }
            );
        });
    });
    describe('CRUD_UPDATE_OPTIMISTIC', () => {
        it('updates the updated record', () => {
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            };

            const now = new Date();
            Object.defineProperty(state, 'fetchedAt', {
                value: {
                    record3: now,
                    record2: now,
                    record1: now,
                },
            });

            assert.deepEqual(
                dataReducer(state, {
                    type: CRUD_UPDATE_OPTIMISTIC,
                    payload: {
                        id: 'record2',
                        data: { prop: 'value updated' },
                    },
                    meta: { effect: UPDATE, optimistic: true },
                }),
                {
                    record1: { id: 'record1', prop: 'value' },
                    record2: { id: 'record2', prop: 'value updated' },
                    record3: { id: 'record3', prop: 'value' },
                }
            );
        });
    });
    describe('CRUD_UPDATE_MANY_OPTIMISTIC', () => {
        it('updates the updated records', () => {
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            };

            const now = new Date();
            Object.defineProperty(state, 'fetchedAt', {
                value: {
                    record3: now,
                    record2: now,
                    record1: now,
                },
            });

            assert.deepEqual(
                dataReducer(state, {
                    type: CRUD_UPDATE_MANY_OPTIMISTIC,
                    payload: {
                        ids: ['record3', 'record2'],
                        data: { prop: 'value updated' },
                    },
                    meta: {
                        effect: UPDATE_MANY,
                        optimistic: true,
                    },
                }),
                {
                    record1: { id: 'record1', prop: 'value' },
                    record2: { id: 'record2', prop: 'value updated' },
                    record3: { id: 'record3', prop: 'value updated' },
                }
            );
        });
    });
    describe('Custom optimistic action with an UPDATE effect', () => {
        it('updates the updated record', () => {
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            };

            const now = new Date();
            Object.defineProperty(state, 'fetchedAt', {
                value: {
                    record3: now,
                    record2: now,
                    record1: now,
                },
            });

            assert.deepEqual(
                dataReducer(state, {
                    type: 'MY_CUSTOM_ACTION',
                    payload: {
                        id: 'record2',
                        data: { endPointSpecificParam: 'value' },
                    },
                    meta: {
                        effect: UPDATE,
                        optimistic: true,
                        effectData: { prop: 'value updated' },
                    },
                }),
                {
                    record1: { id: 'record1', prop: 'value' },
                    record2: { id: 'record2', prop: 'value updated' },
                    record3: { id: 'record3', prop: 'value' },
                }
            );
        });
    });
    describe('Custom optimistic action with an UPDATE_MANY effect', () => {
        it('updates the updated records', () => {
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            };

            const now = new Date();
            Object.defineProperty(state, 'fetchedAt', {
                value: {
                    record3: now,
                    record2: now,
                    record1: now,
                },
            });

            assert.deepEqual(
                dataReducer(state, {
                    type: 'MY_CUSTOM_ACTION',
                    payload: {
                        ids: ['record3', 'record2'],
                        data: { endPointSpecificParam: 'value' },
                    },
                    meta: {
                        effect: UPDATE_MANY,
                        optimistic: true,
                        effectData: { prop: 'value updated' },
                    },
                }),
                {
                    record1: { id: 'record1', prop: 'value' },
                    record2: { id: 'record2', prop: 'value updated' },
                    record3: { id: 'record3', prop: 'value updated' },
                }
            );
        });
    });
    describe('Custom action with an UPDATE effect', () => {
        it('updates the updated record', () => {
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            };

            const now = new Date();
            Object.defineProperty(state, 'fetchedAt', {
                value: {
                    record3: now,
                    record2: now,
                    record1: now,
                },
            });

            assert.deepEqual(
                dataReducer(state, {
                    type: 'MY_CUSTOM_ACTION',
                    payload: {
                        id: 'record2',
                        data: { id: 'record2', prop: 'value updated' },
                    },
                    meta: {
                        effect: UPDATE,
                        fetchStatus: FETCH_END,
                    },
                }),
                {
                    record1: { id: 'record1', prop: 'value' },
                    record2: { id: 'record2', prop: 'value updated' },
                    record3: { id: 'record3', prop: 'value' },
                }
            );
        });
    });
    describe('Custom optimistic action with an UPDATE_MANY effect', () => {
        it('updates the updated records', () => {
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            };

            const now = new Date();
            Object.defineProperty(state, 'fetchedAt', {
                value: {
                    record3: now,
                    record2: now,
                    record1: now,
                },
            });

            assert.deepEqual(
                dataReducer(state, {
                    type: 'MY_CUSTOM_ACTION',
                    payload: {
                        ids: ['record3', 'record2'],
                        data: { prop: 'value updated' },
                    },
                    meta: {
                        effect: UPDATE_MANY,
                        fetchStatus: FETCH_END,
                    },
                }),
                {
                    record1: { id: 'record1', prop: 'value' },
                    record2: { id: 'record2', prop: 'value updated' },
                    record3: { id: 'record3', prop: 'value updated' },
                }
            );
        });
    });
});
