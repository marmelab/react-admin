import React from 'react';
import { shallow } from 'enzyme';
import { linkToRecord } from 'ra-core';

import { DatagridRow } from './DatagridRow';

describe('<DatagridRow />', () => {
    const defaultProps = {
        id: 15,
        basePath: '/blob',
    };

    const event = { preventDefault: () => { }, stopPropagation: () => { } };

    describe('rowClick', () => {
        it("should redirect to edit page if the 'edit' option is selected", () => {
            const push = jest.fn();
            const wrapper = shallow(
                <DatagridRow {...defaultProps} rowClick="edit" push={push} />
            );

            wrapper.instance().handleClick(event);
            expect(push.mock.calls).toEqual([
                [linkToRecord(defaultProps.basePath, defaultProps.id)],
            ]);
        });

        it("should redirect to show page if the 'show' option is selected", () => {
            const push = jest.fn();
            const wrapper = shallow(
                <DatagridRow {...defaultProps} rowClick="show" push={push} />
            );

            wrapper.instance().handleClick(event);
            expect(push.mock.calls).toEqual([
                [linkToRecord(defaultProps.basePath, defaultProps.id, 'show')],
            ]);
        });

        it("should change the expand state if the 'expand' option is selected", () => {
            const wrapper = shallow(
                <DatagridRow {...defaultProps} rowClick="expand" />
            );
            expect(wrapper.state('expanded')).toBeFalsy();

            wrapper.instance().handleClick(event);
            expect(wrapper.state('expanded')).toBeTruthy();

            wrapper.instance().handleClick(event);
            expect(wrapper.state('expanded')).toBeFalsy();
        });

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

        it('should redirect to the custom path if onRowClick is a string', () => {
            const path = '/foo/bar';
            const push = jest.fn();
            const wrapper = shallow(
                <DatagridRow {...defaultProps} rowClick={path} push={push} />
            );

            wrapper.instance().handleClick(event);
            expect(push.mock.calls).toEqual([[path]]);
        });

        it('should evaluate the function and redirect to the result of that function if onRowClick is a custom function', async () => {
            const push = jest.fn();
            const customRowClick = () => '/bar/foo';
            const wrapper = shallow(
                <DatagridRow
                    {...defaultProps}
                    rowClick={customRowClick}
                    push={push}
                />
            );

            await wrapper.instance().handleClick(event);
            expect(push.mock.calls).toEqual([['/bar/foo']]);
        });

        it('should not call push if onRowClick is falsy', () => {
            const push = jest.fn();
            const wrapper = shallow(
                <DatagridRow
                    {...defaultProps}
                    rowClick=""
                    push={push}
                />
            );

            wrapper.instance().handleClick(event);
            expect(push.mock.calls.length).toEqual(0);
        })
    });
});
