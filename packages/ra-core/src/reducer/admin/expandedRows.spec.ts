import expect from 'expect';

import { expandedRows } from './expandedRows';
import { toggleListItemExpand } from '../../actions/listActions';

describe('expanded reducer', () => {
    describe('TOGGLE_LIST_ITEM_EXPAND action', () => {
        it("should add the identifier to the list if it's not present", () => {
            expect(
                expandedRows(
                    { foo: [1, 2, 3, 5] },
                    toggleListItemExpand('foo', 4)
                )
            ).toEqual({ foo: [1, 2, 3, 5, 4] });
        });
        it("should remove the identifier from the list if it's present", () => {
            expect(
                expandedRows(
                    { foo: [1, 2, 3, 5] },
                    toggleListItemExpand('foo', 3)
                )
            ).toEqual({ foo: [1, 2, 5] });
        });
        it('should tolerate identifiers with the wrong type', () => {
            expect(
                expandedRows(
                    { foo: [1, 2, 3, 5] },
                    toggleListItemExpand('foo', '3')
                )
            ).toEqual({ foo: [1, 2, 5] });
            expect(
                expandedRows(
                    { foo: [1, 2, '3', 5] },
                    toggleListItemExpand('foo', 3)
                )
            ).toEqual({ foo: [1, 2, 5] });
        });
        it('should work on a resource without any prior activity', () => {
            expect(expandedRows({}, toggleListItemExpand('foo', 3))).toEqual({
                foo: [3],
            });
        });
        it('should not affect other resources', () => {
            expect(
                expandedRows(
                    { foo: [1, 2, 3, 5], bar: [6, 7, 8] },
                    toggleListItemExpand('foo', 3)
                )
            ).toEqual({ foo: [1, 2, 5], bar: [6, 7, 8] });
        });
    });
});
