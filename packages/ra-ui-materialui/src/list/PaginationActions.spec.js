import React from 'react';
import { shallow } from 'enzyme';

import { PaginationActions } from './PaginationActions';

describe('<PaginationActions />', () => {
    it('should not render any actions when no pagination is necessary', () => {
        const wrapper = shallow(
            <PaginationActions
                page={0}
                rowsPerPage={20}
                count={15}
                translate={x => x}
                onChangePage={() => null}
                classes={{}}
            />
        );
        expect(wrapper.find('WithStyles(Button)')).toHaveLength(0);
        expect(wrapper.find('WithStyles(Typography)')).toHaveLength(0);
    });
    it('should render action buttons when pagination is necessary', () => {
        const wrapper = shallow(
            <PaginationActions
                page={0}
                rowsPerPage={5}
                count={15}
                translate={x => x}
                onChangePage={() => null}
                classes={{}}
            />
        );
        // 1 2 3 next
        expect(wrapper.find('WithStyles(Button)')).toHaveLength(4);
    });

    it('should skip page action buttons when there are too many', () => {
        const wrapper = shallow(
            <PaginationActions
                page={7}
                rowsPerPage={1}
                count={15}
                translate={x => x}
                onChangePage={() => null}
                classes={{}}
            />
        );
        // prev 1 ... 7 8 9 ... 15 next
        expect(wrapper.find('WithStyles(Button)')).toHaveLength(7);
    });
});
