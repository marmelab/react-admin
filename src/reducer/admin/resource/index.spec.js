import assert from 'assert';
import { initialState as props } from './props';
import { initialState as data } from './data';
import { initialState as list } from './list/index.spec';
import createReducer, * as resourceSelectors from './index';

export const initialState = {
    props,
    data,
    list,
};

describe('resource reducer', () => {
    it('should return initial state by default', () => {
        assert.deepEqual(initialState, createReducer()(undefined, {}));
    });
});

describe('resource selectors', () => {
    describe('getData', () => {
        it('should return data state slice ', () => {
            assert.deepEqual(resourceSelectors.getData(initialState), data);
        });
    });

    describe('getRecord', () => {
        it('should return a single record of the data state slice', () => {
            assert.deepEqual(
                resourceSelectors.getRecord(initialState, { id: 1 }),
                undefined
            );
        });
    });

    describe('getRecordsByIds', () => {
        it('should return an object of records of the data state slice', () => {
            assert.deepEqual(
                resourceSelectors.getRecordsByIds(initialState, {
                    ids: [1, 2],
                }),
                {}
            );
        });
    });

    describe('getList', () => {
        it('should return list state slice', () => {
            assert.deepEqual(resourceSelectors.getList(initialState), list);
        });
    });
});
