import React from 'react';
import { cleanup, fireEvent, wait } from 'react-testing-library';
import { push } from 'connected-react-router';
import { renderWithRedux, linkToRecord } from 'ra-core';

import DatagridRow from './DatagridRow';

const TitleField = ({ record }) => <span>{record.title}</span>;
const ExpandPanel = () => <span>expanded</span>;

// remove validateDomNesting warnings by react-testing-library
const table = document.createElement('tbody');
const render = element =>
    renderWithRedux(
        element,
        {},
        { container: document.body.appendChild(table) }
    );

describe('<DatagridRow />', () => {
    afterEach(cleanup);

    const defaultProps = {
        id: 15,
        basePath: '/blob',
        record: { id: 15, title: 'hello' },
    };

    describe('rowClick', () => {
        it("should redirect to edit page if the 'edit' option is selected", () => {
            const { getByText, dispatch } = render(
                <DatagridRow {...defaultProps} rowClick="edit">
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(dispatch.mock.calls[0][0]).toEqual(
                push(linkToRecord(defaultProps.basePath, defaultProps.id))
            );
        });

        it("should redirect to show page if the 'show' option is selected", () => {
            const { getByText, dispatch } = render(
                <DatagridRow {...defaultProps} rowClick="show">
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(dispatch.mock.calls[0][0]).toEqual(
                push(
                    linkToRecord(defaultProps.basePath, defaultProps.id, 'show')
                )
            );
        });

        it("should change the expand state if the 'expand' option is selected", () => {
            const { queryAllByText, getByText } = render(
                <DatagridRow
                    {...defaultProps}
                    rowClick="expand"
                    expand={<ExpandPanel />}
                >
                    <TitleField />
                </DatagridRow>
            );
            expect(queryAllByText('expanded')).toHaveLength(0);
            fireEvent.click(getByText('hello'));
            expect(queryAllByText('expanded')).toHaveLength(1);
            fireEvent.click(getByText('hello'));
            expect(queryAllByText('expanded')).toHaveLength(0);
        });

        it("should execute the onToggleItem function if the 'toggleSelection' option is selected", () => {
            const onToggleItem = jest.fn();
            const { getByText } = render(
                <DatagridRow
                    {...defaultProps}
                    onToggleItem={onToggleItem}
                    rowClick="toggleSelection"
                >
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(onToggleItem.mock.calls.length).toEqual(1);
        });

        it('should redirect to the custom path if onRowClick is a string', () => {
            const path = '/foo/bar';
            const { getByText, dispatch } = render(
                <DatagridRow {...defaultProps} rowClick={path}>
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(dispatch.mock.calls[0][0]).toEqual(push(path));
        });

        it('should evaluate the function and redirect to the result of that function if onRowClick is a custom function', async () => {
            const customRowClick = () => '/bar/foo';
            const { getByText, dispatch } = render(
                <DatagridRow {...defaultProps} rowClick={customRowClick}>
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            await wait(); // wait one tick
            expect(dispatch.mock.calls[0][0]).toEqual(push('/bar/foo'));
        });

        it('should not call push if onRowClick is falsy', () => {
            const { getByText, dispatch } = render(
                <DatagridRow {...defaultProps} rowClick="">
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(dispatch.mock.calls).toHaveLength(0);
        });
    });
});
