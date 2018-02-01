import assert from 'assert';

import { getPossibleReferences } from './possibleValues';

describe('possibleValues', () => {
    describe('getPossibleReferences', () => {
        const state = {
            admin: {
                references: {
                    possibleValues: {
                        'ressourceInError@source': { error: 'error message' },
                        'ressourceEmpty@source': [],
                        'ressource@source': [1, 2, 4],
                    },
                },
                resources: {
                    objects: {
                        data: {
                            1: { name: 'object name 1' },
                            2: { name: 'object name 2' },
                            3: { name: 'object name 3' },
                            4: { name: 'object name 4' },
                            5: { name: 'object name 5' },
                        },
                    },
                },
            },
        };
        it('should return null if there is no referenceSource available in state', () => {
            const possibleReferences = getPossibleReferences(
                state,
                'missingRessource@source',
                'objects'
            );
            assert.equal(possibleReferences, null);
        });

        it('should return an object with error if the referenceSource in state is an error', () => {
            const possibleReferences = getPossibleReferences(
                state,
                'ressourceInError@source',
                'objects'
            );
            assert.deepEqual(possibleReferences, { error: 'error message' });
        });

        it('should return a empty array if the referenceSource in state is empty', () => {
            const possibleReferences = getPossibleReferences(
                state,
                'ressourceEmpty@source',
                'objects'
            );
            assert.deepEqual(possibleReferences, []);
        });

        it('should return all formated referenceSource in state if selectedIds param is not set', () => {
            const possibleReferences = getPossibleReferences(
                state,
                'ressource@source',
                'objects'
            );
            assert.deepEqual(possibleReferences, [
                { name: 'object name 1' },
                { name: 'object name 2' },
                { name: 'object name 4' },
            ]);
        });

        it('should return all formated referenceSource in state if selectedIds param is an empty array', () => {
            const possibleReferences = getPossibleReferences(
                state,
                'ressource@source',
                'objects',
                []
            );
            assert.deepEqual(possibleReferences, [
                { name: 'object name 1' },
                { name: 'object name 2' },
                { name: 'object name 4' },
            ]);
        });

        it("should add selectedIds to the formated referenceSource in state if it's not already in", () => {
            const possibleReferences = getPossibleReferences(
                state,
                'ressource@source',
                'objects',
                [1, 5]
            );
            assert.deepEqual(possibleReferences, [
                { name: 'object name 5' },
                { name: 'object name 1' },
                { name: 'object name 2' },
                { name: 'object name 4' },
            ]);
        });
    });
});
