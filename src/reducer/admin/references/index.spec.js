import assert from 'assert';
import { initialState as oneToManyInitialState } from './oneToMany';
import { initialState as possibleValuesInitialState } from './possibleValues';
import reducer, {
    getOneToMany,
    getIdsRelatedTo,
    getPossibleValues,
} from './index';

export const initialState = {
    oneToMany: oneToManyInitialState,
    possibleValues: possibleValuesInitialState,
};

describe('references reducer', () => {
    it('should return initial state by default', () => {
        assert.deepEqual(initialState, reducer(undefined, {}));
    });
});

describe('references selectors', () => {
    const state = {
        ...initialState,
        oneToMany: {
            nameRelatedTo: [1],
        },
        possibleValues: {
            nameRelatedTo: [1, 2, 3],
        },
    };

    describe('getOneToMany', () => {
        it('should return one to many reducer state slice ', () => {
            assert.deepEqual(getOneToMany(state), {
                nameRelatedTo: [1],
            });
        });
    });

    describe('getIdsRelatedTo', () => {
        it('should return an array of related ids', () => {
            assert.deepEqual(
                getIdsRelatedTo(state, { relatedTo: 'nameRelatedTo' }),
                [1]
            );
        });
    });

    describe('getPossibleValues', () => {
        it('should return possible values state slice', () => {
            assert.deepEqual(getPossibleValues(state), {
                nameRelatedTo: [1, 2, 3],
            });
        });
    });
});
