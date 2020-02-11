import React from 'react';
import expect from 'expect';
import { ChipField } from './ChipField';
import { render, cleanup } from '@testing-library/react';

describe('<ChipField />', () => {
    afterEach(cleanup);

    it('should display the record value added as source', () => {
        const { getByText } = render(
            <ChipField
                className="className"
                classes={{}}
                source="name"
                record={{ name: 'foo' }}
            />
        );
        expect(getByText('foo')).not.toBeNull();
    });

    it('should not display any label added as props', () => {
        const { getByText } = render(
            <ChipField
                className="className"
                classes={{}}
                source="name"
                record={{ name: 'foo' }}
                label="bar"
            />
        );
        expect(getByText('foo')).not.toBeNull();
    });

    it('should render the emptyText when value is empty', () => {
        const { container } = render(
            <ChipField
                className="className"
                classes={{}}
                source="name"
                record={{ name: '' }}
                emptyText="NA"
            />
        );
        expect(container.textContent).toBe('NA');
    });

    it('should render "" when value is empty and emptyText is not present', () => {
        const { container } = render(
            <ChipField
                className="className"
                classes={{}}
                source="name"
                record={{ name: '' }}
            />
        );
        expect(container.textContent).toBe('');
    });
});
