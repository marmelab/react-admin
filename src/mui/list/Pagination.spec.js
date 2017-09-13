import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { Pagination } from './Pagination';

describe('<Pagination />', () => {
    const muiTheme = { palette: {} };
    describe('mobile', () => {
        it('should render a condensed <Toolbar>', () => {
            const wrapper = shallow(
                <Pagination
                    muiTheme={muiTheme}
                    page={2}
                    perPage={5}
                    total={15}
                    translate={x => x}
                    width={1}
                />
            );
            const iconButtons = wrapper.find('IconButton');
            assert.equal(iconButtons.length, 2);
            const flatButtons = wrapper.find('FlatButton');
            assert.equal(flatButtons.length, 0);
        });
        it('should render only the text when no pagination is necessary', () => {
            const wrapper = shallow(
                <Pagination
                    muiTheme={muiTheme}
                    page={1}
                    perPage={20}
                    total={15}
                    translate={x => x}
                    width={1}
                />
            );
            const iconButtons = wrapper.find('IconButton');
            assert.equal(iconButtons.length, 0);
            const span = wrapper.find('span');
            assert.equal(span.text(), 'aor.navigation.page_range_info');
        });
    });
    describe('desktop', () => {
        it('should render a normal <Toolbar>', () => {
            const wrapper = shallow(
                <Pagination
                    muiTheme={muiTheme}
                    page={2}
                    perPage={5}
                    total={15}
                    translate={x => x}
                    width={2}
                />
            );
            const iconButtons = wrapper.find('IconButton');
            assert.equal(iconButtons.length, 0);
            const flatButtons = wrapper.find('FlatButton');
            assert.equal(flatButtons.length, 5);
        });
        it('should render only the text when no pagination is necessary', () => {
            const wrapper = shallow(
                <Pagination
                    muiTheme={muiTheme}
                    page={1}
                    perPage={20}
                    total={15}
                    translate={x => x}
                    width={2}
                />
            );
            const flatButtons = wrapper.find('FlatButton');
            assert.equal(flatButtons.length, 0);
            const span = wrapper.find('span');
            assert.equal(span.text(), 'aor.navigation.page_range_info');
        });
    });
});
