import { getPossibleReferenceValues } from './possibleValues';

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
});
