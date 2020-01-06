import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TextInput from '../input/TextInput';
import Filter from './Filter';

describe('<Filter />', () => {
    afterEach(cleanup);

    describe('With form context', () => {
        const defaultProps = {
            context: 'form',
            resource: 'posts',
            setFilters: jest.fn(),
            hideFilter: jest.fn(),
            showFilter: jest.fn(),
            displayedFilters: { title: true },
        };

        it('should render a <FilterForm /> component', () => {
            const { queryByLabelText } = render(
                <Filter {...defaultProps}>
                    <TextInput source="title" />
                </Filter>
            );

            expect(
                queryByLabelText('resources.posts.fields.title')
            ).not.toBeNull();
        });

        it('should pass `filterValues` as `initialValues` props', () => {
            const { getByDisplayValue } = render(
                <Filter {...defaultProps} filterValues={{ title: 'Lorem' }}>
                    <TextInput source="title" />
                </Filter>
            );

            expect(getByDisplayValue('Lorem')).not.toBeNull();
        });
    });
});
