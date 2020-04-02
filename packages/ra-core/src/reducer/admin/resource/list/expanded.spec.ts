import expect from 'expect';

import expand from './expanded';
import { toggleListItemExpand } from '../../../../actions/listActions';

describe('expanded reducer', () => {
    describe('TOGGLE_LIST_ITEM_EXPAND action', () => {
        it("should add the identifier to the list if it's not present", () => {
            expect(
                expand([1, 2, 3, 5], toggleListItemExpand('foo', 4))
            ).toEqual([1, 2, 3, 5, 4]);
        });
        it("should remove the identifier from the list if it's present", () => {
            expect(
                expand([1, 2, 3, 5], toggleListItemExpand('foo', 3))
            ).toEqual([1, 2, 5]);
        });
        it('should tolerate identifiers with the wrong type', () => {
            expect(
                expand([1, 2, 3, 5], toggleListItemExpand('foo', '3'))
            ).toEqual([1, 2, 5]);
            expect(
                expand([1, 2, '3', 5], toggleListItemExpand('foo', 3))
            ).toEqual([1, 2, 5]);
        });
    });
});
