import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { Pagination } from './Pagination';

describe('<Pagination />', () => {
    describe('mobile', () => {
        it('should render a condensed <Toolbar>', () => {
            const wrapper = shallow(
                <Pagination
                    page={2}
                    perPage={5}
                    total={15}
                    translate={x => x}
                />
            )
                .shallow()
                .shallow()
                .setProps({ width: 'xs' })
                .shallow()
                .shallow();
            const iconButtons = wrapper.find('withStyles(IconButton)');
            assert.equal(iconButtons.length, 2);
            const flatButtons = wrapper.find('withStyles(Button)');
            assert.equal(flatButtons.length, 0);
        });
        it('should render only the text when no pagination is necessary', () => {
            const wrapper = shallow(
                <Pagination
                    page={1}
                    perPage={20}
                    total={15}
                    translate={x => x}
                    width={1}
                />
            )
                .shallow()
                .shallow()
                .setProps({ width: 'xs' })
                .shallow()
                .shallow();
            const iconButtons = wrapper.find('withStyles(IconButton)');
            assert.equal(iconButtons.length, 0);
            const typography = wrapper.find('withStyles(Typography)');
            assert.equal(
                typography
                    .shallow()
                    .shallow()
                    .text(),
                'ra.navigation.page_range_info'
            );
        });
    });
    describe('desktop', () => {
        it('should render a normal <Toolbar>', () => {
            const wrapper = shallow(
                <Pagination
                    page={2}
                    perPage={5}
                    total={15}
                    translate={x => x}
                    width={2}
                />
            )
                .shallow()
                .shallow()
                .shallow()
                .shallow();
            const iconButtons = wrapper.find('withStyles(IconButton)');
            assert.equal(iconButtons.length, 0);
            const flatButtons = wrapper.find('withStyles(Button)');
            assert.equal(flatButtons.length, 5);
        });
        it('should render only the text when no pagination is necessary', () => {
            const wrapper = shallow(
                <Pagination
                    page={1}
                    perPage={20}
                    total={15}
                    translate={x => x}
                    width={2}
                />
            )
                .shallow()
                .shallow()
                .shallow()
                .shallow();
            const flatButtons = wrapper.find('withStyles(Button)');
            assert.equal(flatButtons.length, 0);
            const typography = wrapper.find('withStyles(Typography)');
            assert.equal(
                typography
                    .shallow()
                    .shallow()
                    .text(),
                'ra.navigation.page_range_info'
            );
        });
    });
});
