import { getPossibleReferenceValues, getPossibleReferences } from './possibleValues';

describe('possibleValues reducer', () => {
    describe('getPossibleReferenceValues selector', () => {
        it('should return references', () => {
            const state = {
                'foo@bar': [1, 2, 3],
            };
            const props = {
                resource: 'foo',
                source: 'bar',
                referenceSource: (resource, source) => `${resource}@${source}`,
            };
            expect(getPossibleReferenceValues(state, props)).toEqual([1, 2, 3]);
        });
    });

    describe('getPossibleReferences', () => {
        const referenceState = {
            data: {
                1: { name: 'object name 1' },
                2: { name: 'object name 2' },
                3: { name: 'object name 3' },
                4: { name: 'object name 4' },
                5: { name: 'object name 5' },
            },
        };
        it('should return null if there is no possibleValues available in state', () => {
            const possibleReferences = getPossibleReferences(referenceState, null);
            expect(possibleReferences).toEqual(null);
        });

        it('should return an object with error if the possibleValues in state is an error', () => {
            const possibleReferences = getPossibleReferences(referenceState, {
                error: 'error message',
            });
            expect(possibleReferences).toEqual({ error: 'error message' });
        });

        it('should return a empty array if the possibleValues in state is empty', () => {
            const possibleReferences = getPossibleReferences(referenceState, []);
            expect(possibleReferences).toEqual([]);
        });

        it('should return all formated possibleValues in state if selectedIds param is not set', () => {
            const possibleReferences = getPossibleReferences(referenceState, [1, 2, 4]);
            expect(possibleReferences).toEqual([
                { name: 'object name 1' },
                { name: 'object name 2' },
                { name: 'object name 4' },
            ]);
        });

        it('should return all formated possibleValues in state if selectedIds param is an empty array', () => {
            const possibleReferences = getPossibleReferences(referenceState, [1, 2, 4], []);
            expect(possibleReferences).toEqual([
                { name: 'object name 1' },
                { name: 'object name 2' },
                { name: 'object name 4' },
            ]);
        });

        it('should add selectedIds to the formated possibleValues in state if it is not already in', () => {
            const possibleReferences = getPossibleReferences(referenceState, [1, 2, 4], [1, 5]);
            expect(possibleReferences).toEqual([
                { name: 'object name 5' },
                { name: 'object name 1' },
                { name: 'object name 2' },
                { name: 'object name 4' },
            ]);
        });
    });
});
