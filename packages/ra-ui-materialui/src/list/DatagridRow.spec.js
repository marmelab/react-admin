import React from 'react';
import { cleanup, fireEvent, wait } from '@testing-library/react';
import { renderWithRedux, linkToRecord } from 'ra-core';

import DatagridRow from './DatagridRow';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const TitleField = ({ record }) => <span>{record.title}</span>;
const ExpandPanel = () => <span>expanded</span>;

// remove validateDomNesting warnings by react-testing-library
const render = element =>
    renderWithRedux(
        <table>
            <tbody>{element}</tbody>
        </table>,
        {}
    );

describe('<DatagridRow />', () => {
    afterEach(cleanup);

    const defaultProps = {
        id: 15,
        basePath: '/blob',
        record: { id: 15, title: 'hello' },
    };

    const renderWithRouter = children => {
        const history = createMemoryHistory();

        return {
            history,
            ...render(<Router history={history}>{children}</Router>),
        };
    };

    describe('rowClick', () => {
        it("should redirect to edit page if the 'edit' option is selected", () => {
            const { getByText, history } = renderWithRouter(
                <DatagridRow {...defaultProps} rowClick="edit">
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(history.location.pathname).toEqual(
                linkToRecord(defaultProps.basePath, defaultProps.id)
            );
        });

        it("should redirect to show page if the 'show' option is selected", () => {
            const { getByText, history } = renderWithRouter(
                <DatagridRow {...defaultProps} rowClick="show">
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(history.location.pathname).toEqual(
                linkToRecord(defaultProps.basePath, defaultProps.id, 'show')
            );
        });

        it("should change the expand state if the 'expand' option is selected", () => {
            const { queryAllByText, getByText } = renderWithRouter(
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
            const { getByText } = renderWithRouter(
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
            const { getByText, history } = renderWithRouter(
                <DatagridRow {...defaultProps} rowClick={path}>
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(history.location.pathname).toEqual(path);
        });

        it('should evaluate the function and redirect to the result of that function if onRowClick is a custom function', async () => {
            const customRowClick = () => '/bar/foo';
            const { getByText, history } = renderWithRouter(
                <DatagridRow {...defaultProps} rowClick={customRowClick}>
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            await wait(); // wait one tick
            expect(history.location.pathname).toEqual('/bar/foo');
        });

        it('should not call push if onRowClick is falsy', () => {
            const { getByText, history } = renderWithRouter(
                <DatagridRow {...defaultProps} rowClick="">
                    <TitleField />
                </DatagridRow>
            );
            fireEvent.click(getByText('hello'));
            expect(history.location.pathname).toEqual('/');
        });
    });
});
