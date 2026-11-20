import { ignoreValuesWithoutInput } from './ignoreValuesWithoutInput';

describe('ignoreValuesWithoutInput', () => {
    it('should keep the values from the location that have an input', () => {
        expect(
            ignoreValuesWithoutInput(
                { id: 1, name: 'Jane' },
                { name: 'Jane' },
                { id: 1, name: 'John' },
                ['name']
            )
        ).toEqual({ id: 1, name: 'Jane' });
    });
    it('should replace the values from the location that have no input by their initial value', () => {
        expect(
            ignoreValuesWithoutInput(
                { id: 2, name: 'Jane', role: 'admin' },
                { id: 2, name: 'Jane', role: 'admin' },
                { id: 1, name: 'John', role: 'user' },
                ['name']
            )
        ).toEqual({ id: 1, name: 'Jane', role: 'user' });
    });
    it('should remove the values from the location that have no input and no initial value', () => {
        expect(
            ignoreValuesWithoutInput(
                { name: 'Jane', role: 'admin' },
                { name: 'Jane', role: 'admin' },
                {},
                ['name']
            )
        ).toEqual({ name: 'Jane' });
    });
    it('should handle nested values', () => {
        expect(
            ignoreValuesWithoutInput(
                { address: { city: 'Nancy', verified: true }, tags: ['a'] },
                { address: { city: 'Nancy', verified: true }, tags: ['a'] },
                { address: { city: 'Paris', verified: false } },
                ['address.city', 'tags']
            )
        ).toEqual({ address: { city: 'Nancy', verified: false }, tags: ['a'] });
    });
    it('should keep a nested value covered by an input on its parent', () => {
        expect(
            ignoreValuesWithoutInput(
                { address: { city: 'Nancy', verified: true } },
                { address: { city: 'Nancy', verified: true } },
                { address: { city: 'Paris', verified: false } },
                ['address']
            )
        ).toEqual({ address: { city: 'Nancy', verified: true } });
    });
    it('should only keep the array item values that have an input', () => {
        expect(
            ignoreValuesWithoutInput(
                {
                    items: [
                        { title: 'A', price: 0 },
                        { title: 'B', price: 0 },
                    ],
                },
                {
                    items: [
                        { title: 'A', price: 0 },
                        { title: 'B', price: 0 },
                    ],
                },
                { items: [{ title: 'a', price: 10 }] },
                ['items.0.title', 'items.1.title']
            )
        ).toEqual({
            items: [{ title: 'A', price: 10 }, { title: 'B' }],
        });
    });
    it('should not mistake a key containing a dot for a nested input', () => {
        expect(
            ignoreValuesWithoutInput(
                { address: { city: 'Paris' }, 'address.city': 'Nancy' },
                { 'address.city': 'Nancy' },
                { address: { city: 'Paris' } },
                ['address.city']
            )
        ).toEqual({ address: { city: 'Paris' } });
    });
    it('should return the values unchanged when there are no values from the location', () => {
        expect(
            ignoreValuesWithoutInput({ name: 'John' }, null, {}, ['name'])
        ).toEqual({ name: 'John' });
    });
});
