import React from 'react';
import expect from 'expect';
import { render, cleanup } from 'react-testing-library';

import { Pagination } from './Pagination';

describe('<Pagination />', () => {
    const defaultProps = {
        rowsPerPage: 10,
        translate: x => x,
    };

    afterEach(cleanup);

    describe('no results mention', () => {
        it('should display a pagination limit when there is no result', () => {
            const { queryByText } = render(
                <Pagination {...defaultProps} total={0} />
            );
            expect(queryByText('ra.navigation.no_results')).not.toBeNull();
        });

        it('should not display a pagination limit when there are results', () => {
            const { queryByText } = render(
                <Pagination {...defaultProps} total={1} />
            );
            expect(queryByText('ra.navigation.no_results')).toBeNull();
        });

        it('should not display a pagination limit on an out of bounds page', () => {
            const { queryByText } = render(
                <Pagination {...defaultProps} total={10} page={2} />
            );
            expect(queryByText('ra.navigation.no_results')).toBeNull();
        });
    });

    describe('Pagination buttons', () => {
        it('should display a next button when there are more results', () => {
            const { queryByText } = render(
                <Pagination
                    {...defaultProps}
                    rowsPerPage={1}
                    total={2}
                    page={1}
                />
            );
            expect(queryByText('ra.navigation.next')).not.toBeNull();
        });
        it('should not display a next button when there are no more results', () => {
            const { queryByText } = render(
                <Pagination
                    {...defaultProps}
                    rowsPerPage={1}
                    total={2}
                    page={2}
                />
            );
            expect(queryByText('ra.navigation.next')).toBeNull();
        });
        it('should display a prev button when there are previous results', () => {
            const { queryByText } = render(
                <Pagination
                    {...defaultProps}
                    rowsPerPage={1}
                    total={2}
                    page={2}
                />
            );
            expect(queryByText('ra.navigation.prev')).not.toBeNull();
        });
        it('should not display a prev button when there are no previous results', () => {
            const { queryByText } = render(
                <Pagination
                    {...defaultProps}
                    rowsPerPage={1}
                    total={2}
                    page={1}
                />
            );
            expect(queryByText('ra.navigation.prev')).toBeNull();
        });
    });

    describe('mobile', () => {
        it('should not render a rowsPerPage choice', () => {
            const { queryByText } = render(
                <Pagination
                    {...defaultProps}
                    page={2}
                    perPage={5}
                    total={15}
                    width="xs"
                />
            );
            expect(queryByText('ra.navigation.page_rows_per_page')).toBeNull();
        });
    });

    describe('desktop', () => {
        it('should render rowsPerPage choice', () => {
            const { queryByText } = render(
                <Pagination
                    {...defaultProps}
                    page={2}
                    perPage={5}
                    total={15}
                    width="md"
                />
            );

            expect(
                queryByText('ra.navigation.page_rows_per_page')
            ).not.toBeNull();
        });
    });
});
