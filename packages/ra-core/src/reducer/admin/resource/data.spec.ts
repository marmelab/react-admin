import expect from 'expect';

import {
    DELETE,
    DELETE_MANY,
    UPDATE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    GET_ONE,
} from '../../../core';
import getFetchedAt from '../../../util/getFetchedAt';
import dataReducer, {
    addRecordsAndRemoveOutdated,
    addRecords,
    addOneRecord,
    removeRecords,
} from './data';
import { FETCH_END } from '../../../actions';

jest.mock('../../../util/getFetchedAt');

describe('data reducer', () => {
    describe('addRecordsAndRemoveOutdated', () => {
        it('should call getFetchedAt with newRecords ids and oldRecordFetchedAt and return records returned by getFetchedAt', () => {
            const newRecords = [{ id: 'record1' }, { id: 'record2' }];
            const oldFetchedAt = {};
            const date1 = new Date();
            const date2 = new Date();
            const oldRecords = {
                fetchedAt: oldFetchedAt,
            };
            // @ts-ignore
            getFetchedAt.mockImplementationOnce(() => ({
                record1: date1,
                record2: date2,
            }));

            const newState = addRecordsAndRemoveOutdated(
                newRecords,
                oldRecords
            );

            // @ts-ignore
            expect(getFetchedAt.mock.calls[0]).toEqual([
                ['record1', 'record2'],
                oldFetchedAt,
            ]);

            expect(newState).toEqual({
                record1: { id: 'record1' },
                record2: { id: 'record2' },
            });

            expect(newState.fetchedAt).toEqual({
                record1: date1,
                record2: date2,
            });
        });

        it('should discard record that do not have their ids returned by getFetchedAt', () => {
            const newRecords = [{ id: 'record1' }, { id: 'record2' }];
            const oldRecords = {
                record3: { id: 'record3' },
                fetchedAt: { record3: new Date() },
            };

            // @ts-ignore
            getFetchedAt.mockImplementationOnce(() => ({
                record1: new Date(),
                record2: new Date(),
            }));

            const newState = addRecordsAndRemoveOutdated(
                newRecords,
                oldRecords
            );

            expect(newState).toEqual({
                record1: { id: 'record1' },
                record2: { id: 'record2' },
            });
        });

        it('should keep record that have their ids returned by getFetchedAt', () => {
            const newRecords = [{ id: 'record1' }, { id: 'record2' }];
            const oldRecords = {
                record3: { id: 'record3' },
                fetchedAt: { record3: new Date() },
            };
            // @ts-ignore
            getFetchedAt.mockImplementationOnce(() => ({
                record1: new Date(),
                record2: new Date(),
                record3: new Date(),
            }));

            const newState = addRecordsAndRemoveOutdated(
                newRecords,
                oldRecords
            );

            expect(newState).toEqual({
                record1: { id: 'record1' },
                record2: { id: 'record2' },
                record3: { id: 'record3' },
            });
        });

        it('should replace oldRecord by new record', () => {
            const newRecords = [
                { id: 'record1', title: 'new title' },
                { id: 'record2' },
            ];
            const oldRecords = {
                record1: { id: 'record1', title: 'old title' },
                fetchedAt: { record1: new Date() },
            };
            // @ts-ignore
            getFetchedAt.mockImplementationOnce(() => ({
                record1: new Date(),
                record2: new Date(),
            }));

            const newState = addRecordsAndRemoveOutdated(
                newRecords,
                oldRecords
            );

            expect(newState).toEqual({
                record1: { id: 'record1', title: 'new title' },
                record2: { id: 'record2' },
            });
        });
    });

    describe('addRecords', () => {
        it('should add new records without changing the old ones', () => {
            const now = new Date();
            const before = new Date(0);
            const newRecords = [
                { id: 'new_record1', title: 'new title 1' },
                { id: 'new_record2', title: 'new title 2' },
            ];
            const oldRecords = {
                record1: { id: 'record1', title: 'title 1' },
                record2: { id: 'record2', title: 'title 2' },
                fetchedAt: { record1: before, record2: before },
            };
            // @ts-ignore
            getFetchedAt.mockImplementationOnce(() => ({
                new_record1: now,
                new_record2: now,
            }));

            const newState = addRecords(newRecords, oldRecords);

            expect(newState).toEqual({
                record1: { id: 'record1', title: 'title 1' },
                record2: { id: 'record2', title: 'title 2' },
                new_record1: { id: 'new_record1', title: 'new title 1' },
                new_record2: { id: 'new_record2', title: 'new title 2' },
            });

            expect(newState.fetchedAt).toEqual({
                record1: before,
                record2: before,
                new_record1: now,
                new_record2: now,
            });
        });

        it('should update existing records without changing the other ones', () => {
            const now = new Date();
            const before = new Date(0);
            const newRecords = [
                { id: 'new_record1', title: 'new title 1' },
                { id: 'record2', title: 'updated title 2' },
            ];
            const oldRecords = {
                record1: { id: 'record1', title: 'title 1' },
                record2: { id: 'record2', title: 'title 2' },
                fetchedAt: { record1: before, record2: before },
            };
            // @ts-ignore
            getFetchedAt.mockImplementationOnce(() => ({
                new_record1: now,
                record2: now,
            }));

            const newState = addRecords(newRecords, oldRecords);

            expect(newState).toEqual({
                record1: { id: 'record1', title: 'title 1' },
                record2: { id: 'record2', title: 'updated title 2' },
                new_record1: { id: 'new_record1', title: 'new title 1' },
            });

            expect(newState.fetchedAt).toEqual({
                record1: before,
                record2: now,
                new_record1: now,
            });
        });

        it('should reuse oldRecord if new record is the same', () => {
            const now = new Date();
            const before = new Date(0);
            const newRecords = [
                { id: 'record1', title: 'title 1' }, // same as before
            ];
            const oldRecords = {
                record1: { id: 'record1', title: 'title 1' },
                record2: { id: 'record2', title: 'title 2' },
                fetchedAt: { record1: before, record2: before },
            };
            // @ts-ignore
            getFetchedAt.mockImplementationOnce(() => ({
                record1: now,
            }));

            const newState = addRecords(newRecords, oldRecords);

            expect(newState).toEqual({
                record1: { id: 'record1', title: 'title 1' },
                record2: { id: 'record2', title: 'title 2' },
            });
            expect(newState.record1).toEqual(oldRecords.record1);

            expect(newState.fetchedAt).toEqual({
                record1: now,
                record2: before,
            });
        });
    });

    describe('addOneRecord', () => {
        it('should add given record without changing the others', () => {
            const now = new Date();
            const before = new Date(0);
            const newRecord = { id: 'new_record', title: 'new title' };
            const oldRecords = {
                record1: { id: 'record1', title: 'title 1' },
                record2: { id: 'record2', title: 'title 2' },
                fetchedAt: { record1: before, record2: before },
            };

            const newState = addOneRecord(newRecord, oldRecords, now);

            expect(newState).toEqual({
                record1: { id: 'record1', title: 'title 1' },
                record2: { id: 'record2', title: 'title 2' },
                new_record: { id: 'new_record', title: 'new title' },
            });

            expect(newState.fetchedAt).toEqual({
                record1: before,
                record2: before,
                new_record: now,
            });
        });

        it('should update given record without changing the others', () => {
            const now = new Date();
            const before = new Date(0);
            const newRecord = { id: 'record1', title: 'new title' };
            const oldRecords = {
                record1: { id: 'record1', title: 'title 1' },
                record2: { id: 'record2', title: 'title 2' },
                fetchedAt: { record1: before, record2: before },
            };

            const newState = addOneRecord(newRecord, oldRecords, now);

            expect(newState).toEqual({
                record1: { id: 'record1', title: 'new title' },
                record2: { id: 'record2', title: 'title 2' },
            });

            expect(newState.fetchedAt).toEqual({
                record1: now,
                record2: before,
            });
        });
    });

    describe('removeRecords', () => {
        it('should remove the records passed as arguments when using integer ids', () => {
            const before = new Date(0);
            const oldRecords = {
                0: { id: 0, title: 'title 1' },
                1: { id: 1, title: 'title 2' },
                fetchedAt: { 0: before, 1: before },
            };

            const newState = removeRecords([1], oldRecords);

            expect(newState).toEqual({
                0: { id: 0, title: 'title 1' },
            });

            expect(newState.fetchedAt).toEqual({
                0: before,
            });
        });

        it('should remove the records passed as arguments when using string ids', () => {
            const before = new Date(0);
            const oldRecords = {
                record1: { id: 'record1', title: 'title 1' },
                record2: { id: 'record2', title: 'title 2' },
                fetchedAt: { record1: before, record2: before },
            };

            const newState = removeRecords(['record2'], oldRecords);

            expect(newState).toEqual({
                record1: { id: 'record1', title: 'title 1' },
            });

            expect(newState.fetchedAt).toEqual({
                record1: before,
            });
        });

        it('should remove the records passed as arguments when using mixed ids', () => {
            const before = new Date(0);
            const oldRecords = {
                '0': { id: 0, title: 'title 1' },
                '1': { id: 1, title: 'title 2' },
                fetchedAt: { '0': before, '1': before },
            };

            const newState = removeRecords(['1'], oldRecords);

            expect(newState).toEqual({
                '0': { id: 0, title: 'title 1' },
            });

            expect(newState.fetchedAt).toEqual({
                '0': before,
            });
        });
    });

    describe('optimistic DELETE', () => {
        it('removes the deleted record', () => {
            const now = new Date();
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
                fetchedAt: {
                    record1: now,
                    record2: now,
                    record3: now,
                },
            };

            const newState = dataReducer(state, {
                type: 'FOO',
                payload: { id: 'record2' },
                meta: {
                    fetch: DELETE,
                    optimistic: true,
                },
            });
            expect(newState).toEqual({
                record1: { id: 'record1', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
            });
            expect(newState.fetchedAt).toEqual({
                record1: now,
                record3: now,
            });
        });
    });
    describe('optimistic DELETE_MANY', () => {
        it('removes the deleted records', () => {
            const now = new Date();
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
                fetchedAt: {
                    record1: now,
                    record2: now,
                    record3: now,
                },
            };

            const newState = dataReducer(state, {
                type: 'FOO',
                payload: { ids: ['record3', 'record2'] },
                meta: {
                    fetch: DELETE_MANY,
                    optimistic: true,
                },
            });
            expect(newState).toEqual({
                record1: { id: 'record1', prop: 'value' },
            });
            expect(newState.fetchedAt).toEqual({
                record1: now,
            });
        });
    });
    describe('optimistic UPDATE', () => {
        it('update the given record without touching the other', () => {
            const before = new Date(0);
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
                fetchedAt: {
                    record1: before,
                    record2: before,
                    record3: before,
                },
            };

            const newState = dataReducer(state, {
                type: 'FOO',
                payload: { id: 'record2', data: { prop: 'new value' } },
                meta: {
                    fetch: UPDATE,
                    optimistic: true,
                },
            });
            expect(newState).toEqual({
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'new value' },
                record3: { id: 'record3', prop: 'value' },
            });
            expect(newState.fetchedAt.record1).toEqual(before);
            expect(newState.fetchedAt.record3).toEqual(before);

            expect(newState.fetchedAt.record2).not.toEqual(before);
        });
    });

    describe.each([UPDATE, CREATE, GET_ONE])('%s', actionType => {
        it('update the given record without touching the other', () => {
            const before = new Date(0);
            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
                fetchedAt: {
                    record1: before,
                    record2: before,
                    record3: before,
                },
            };

            const newState = dataReducer(state, {
                type: 'FOO',
                payload: { data: { id: 'record2', prop: 'new value' } },
                meta: {
                    fetchResponse: actionType,
                    fetchStatus: FETCH_END,
                },
            });
            expect(newState).toEqual({
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'new value' },
                record3: { id: 'record3', prop: 'value' },
            });
            expect(newState.fetchedAt.record1).toEqual(before);
            expect(newState.fetchedAt.record3).toEqual(before);

            expect(newState.fetchedAt.record2).not.toEqual(before);
        });
    });

    describe.each([GET_MANY_REFERENCE, GET_MANY])('%s', actionType => {
        it('should add new records to the old one', () => {
            const before = new Date(0);
            const now = new Date();

            // @ts-ignore
            getFetchedAt.mockImplementationOnce(() => ({
                new_record: now,
                record2: now,
            }));

            const state = {
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'value' },
                record3: { id: 'record3', prop: 'value' },
                fetchedAt: {
                    record1: before,
                    record2: before,
                    record3: before,
                },
            };

            const newState = dataReducer(state, {
                type: actionType,
                payload: {
                    data: [
                        { id: 'record2', prop: 'updated value' },
                        { id: 'new_record', prop: 'new value' },
                    ],
                },
                meta: {
                    fetchResponse: actionType,
                    fetchStatus: FETCH_END,
                },
            });
            expect(newState).toEqual({
                record1: { id: 'record1', prop: 'value' },
                record2: { id: 'record2', prop: 'updated value' },
                record3: { id: 'record3', prop: 'value' },
                new_record: { id: 'new_record', prop: 'new value' },
            });
            expect(newState.fetchedAt.record1).toEqual(before);
            expect(newState.fetchedAt.record3).toEqual(before);

            expect(newState.fetchedAt.record2).not.toEqual(before);
            expect(newState.fetchedAt.new_record).not.toEqual(before);
        });
    });
});
