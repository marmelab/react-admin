import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { DatagridRow } from './DatagridRow';

describe('<DatagridRow />', () => {
    const defaultProps = {};
    const event = { preventDefault: () => {}, stopPropagation: () => {} };

    describe('on click event, depending on rowClick prop', () => {
        it("should execute the onToggleItem function if the 'toggleSelection' option is selected", () => {
            const onToggleItem = jest.fn();

            const wrapper = shallow(
                <DatagridRow
                    {...defaultProps}
                    onToggleItem={onToggleItem}
                    rowClick="toggleSelection"
                />
            );

            wrapper.instance().handleClick(event);

            expect(onToggleItem.mock.calls.length).toEqual(1);
        });
    });
});
