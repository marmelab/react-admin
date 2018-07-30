import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import { TranslationProvider } from 'ra-core';

import { Pagination } from './Pagination';

describe('<Pagination />', () => {
    it('should display a pagination limit when there is no result', () => {
        const wrapper = shallow(
            <Pagination
                translate={x => x}
                total={0}
                changeFormValue={() => true}
                changeListParams={() => true}
            />
        );
        expect(wrapper.find('pure(translate(PaginationLimit))')).toHaveLength(
            1
        );
    });

    it('should not display a pagination limit when there are results', () => {
        const wrapper = shallow(
            <Pagination
                translate={x => x}
                total={1}
                ids={[1]}
                changeFormValue={() => true}
                changeListParams={() => true}
            />
        );
        expect(wrapper.find('pure(translate(PaginationLimit))')).toHaveLength(
            0
        );
    });

    it('should display a pagination limit on an empty paginated page', () => {
        const wrapper = shallow(
            <Pagination
                translate={x => x}
                total={10}
                ids={[]}
                page={2}
                perPage={10}
                changeFormValue={() => true}
                changeListParams={() => true}
            />
        );
        expect(wrapper.find('pure(translate(PaginationLimit))')).toHaveLength(
            1
        );
    });

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
            const iconButtons = wrapper.find('WithStyles(IconButton)');
            assert.equal(iconButtons.length, 2);
            const flatButtons = wrapper.find('WithStyles(Button)');
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
            const iconButtons = wrapper.find('WithStyles(IconButton)');
            assert.equal(iconButtons.length, 0);
            const typography = wrapper.find('WithStyles(Typography)');
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
            const iconButtons = wrapper.find('WithStyles(IconButton)');
            assert.equal(iconButtons.length, 0);
            const flatButtons = wrapper.find('WithStyles(Button)');
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
            const flatButtons = wrapper.find('WithStyles(Button)');
            assert.equal(flatButtons.length, 0);
            const typography = wrapper.find('WithStyles(Typography)');
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
