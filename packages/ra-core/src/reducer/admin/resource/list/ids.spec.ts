import idsReducer from './ids';
import {
    CRUD_GET_LIST_SUCCESS,
    CRUD_CREATE_SUCCESS,
} from '../../../../actions';
import { DELETE, DELETE_MANY } from '../../../../core';

describe('ids reducer', () => {
    describe('DELETE', () => {
        it('should remove id from ids on Delete action', () => {
            const action = {
                type: DELETE,
                payload: {
                    id: 'record2',
                },
                meta: {
                    fetch: DELETE,
                    optimistic: true,
                },
            };
            const newState = idsReducer(
                ['record1', 'record2', 'record3'],
                action
            );
            expect(newState).toEqual(['record1', 'record3']);
        });
    });

    describe('DELETE_MANY', () => {
        it('should remove ids from ids on DELETE_MANY action', () => {
            const action = {
                type: DELETE_MANY,
                payload: {
                    ids: ['record1', 'record3'],
                },
                meta: {
                    fetch: DELETE_MANY,
                    optimistic: true,
                },
            };
            const newState = idsReducer(
                ['record1', 'record2', 'record3'],
                action
            );
            expect(newState).toEqual(['record2']);
        });
    });

    describe('CRUD_GET_LIST_SUCCESS', () => {
        it('should replace ids with ids from action', () => {
            const action = {
                type: CRUD_GET_LIST_SUCCESS,
                payload: {
                    data: [
                        { id: 'new_record1' },
                        { id: 'new_record2' },
                        { id: 'new_record3' },
                    ],
                },
            };
            const newState = idsReducer(
                ['record1', 'record2', 'record3'],
                action
            );
            expect(newState).toEqual([
                'new_record1',
                'new_record2',
                'new_record3',
            ]);
        });
    });

    describe('CRUD_CREATE_SUCCESS', () => {
        it('should add new id at the start of ids', () => {
            const action = {
                type: CRUD_CREATE_SUCCESS,
                payload: {
                    data: { id: 'new_record' },
                },
            };
            const newState = idsReducer(
                ['record1', 'record2', 'record3'],
                action
            );
            expect(newState).toEqual([
                'new_record',
                'record1',
                'record2',
                'record3',
            ]);
        });
    });
});
