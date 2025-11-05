import { checkHasDirtyFields } from './useFormIsDirty';

describe('useFormIsDirty', () => {
    describe('checkHasDirtyFields', () => {
        it('should return true if any field is dirty on simple forms', () => {
            const dirtyFields = { name: true, age: false };
            expect(checkHasDirtyFields(dirtyFields)).toBe(true);
        });

        it('should return false if no field is dirty on simple forms', () => {
            const dirtyFields = { name: false, age: false };
            expect(checkHasDirtyFields(dirtyFields)).toBe(false);
        });

        it('should return true if any field is dirty on forms with nested fields', () => {
            const dirtyFields = {
                name: false,
                age: false,
                address: { street: true, city: false },
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(true);
        });

        it('should return false if no field is dirty on forms with nested fields', () => {
            const dirtyFields = {
                name: false,
                age: false,
                address: { street: false, city: false },
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(false);
        });

        it('should return true if any field is dirty on forms with array of scalar fields', () => {
            const dirtyFields = {
                name: false,
                age: false,
                hobbies: [true, false],
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(true);
        });

        it('should return false if no field is dirty on forms with array of scalar fields', () => {
            const dirtyFields = {
                name: false,
                age: false,
                hobbies: [false, false],
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(false);
        });

        it('should return true if any field is dirty on forms with array of objects', () => {
            const dirtyFields = {
                name: false,
                age: false,
                hobbies: [{ name: true }, { name: false }],
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(true);
        });

        it('should return false if no field is dirty on forms with array of objects', () => {
            const dirtyFields = {
                name: false,
                age: false,
                hobbies: [{ name: false }, { name: false }],
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(false);
        });

        it('should return true if any field is dirty on forms with nested array of objects', () => {
            const dirtyFields = {
                name: false,
                age: false,
                address: {
                    street: false,
                    city: [{ name: true }, { name: false }],
                },
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(true);
        });

        it('should return false if no field is dirty on forms with nested array of objects', () => {
            const dirtyFields = {
                name: false,
                age: false,
                address: {
                    street: false,
                    city: [{ name: false }, { name: false }],
                },
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(false);
        });

        // nested array of scalar values
        it('should return true if any field is dirty on forms with nested array of scalar values', () => {
            const dirtyFields = {
                name: false,
                age: false,
                hobbies: [
                    { name: false, tags: [true, true] },
                    { name: false, tags: [false, false] },
                ],
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(true);
        });

        it('should return false if no field is dirty on forms with nested array of scalar values', () => {
            const dirtyFields = {
                name: false,
                age: false,
                hobbies: [
                    { name: false, tags: [false, false] },
                    { name: false, tags: [false, false] },
                ],
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(false);
        });

        it('should return true when an array contains an empty object (new item)', () => {
            const dirtyFields = {
                name: false,
                age: false,
                hobbies: [{}], // empty object should be considered dirty
            };
            expect(checkHasDirtyFields(dirtyFields)).toBe(true);
        });

        it('should return true when an array contains undefined entries (new item)', () => {
            const dirtyFields = {
                name: false,
                age: false,
                hobbies: [undefined], // undefined should be considered dirty
            } as any;
            expect(checkHasDirtyFields(dirtyFields)).toBe(true);
        });
    });
});
