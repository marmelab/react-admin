import { render } from '@testing-library/react';
import * as React from 'react';

import { Responsive } from './Responsive';

describe('<Responsive>', () => {
    const Small = () => <div>Small</div>;
    const Medium = () => <div>Medium</div>;
    const Large = () => <div>Large</div>;

    it('should render the small component on small screens', () => {
        const { queryByText } = render(
            <Responsive
                small={<Small />}
                medium={<Medium />}
                large={<Large />}
                width="xs"
            />
        );
        expect(queryByText('Small')).not.toBeNull();
        expect(queryByText('Medium')).toBeNull();
        expect(queryByText('Large')).toBeNull();
    });

    it('should render the medium component on small screens and small is null', () => {
        const { queryByText } = render(
            <Responsive medium={<Medium />} large={<Large />} width="xs" />
        );
        expect(queryByText('Small')).toBeNull();
        expect(queryByText('Medium')).not.toBeNull();
        expect(queryByText('Large')).toBeNull();
    });

    it('should render the medium component on medium screens', () => {
        const { queryByText } = render(
            <Responsive
                small={<Small />}
                medium={<Medium />}
                large={<Large />}
                width="md"
            />
        );
        expect(queryByText('Small')).toBeNull();
        expect(queryByText('Medium')).not.toBeNull();
        expect(queryByText('Large')).toBeNull();
    });

    it('should render the large component on medium screens and medium is null', () => {
        const { queryByText } = render(
            <Responsive small={<Small />} large={<Large />} width="md" />
        );
        expect(queryByText('Small')).toBeNull();
        expect(queryByText('Medium')).toBeNull();
        expect(queryByText('Large')).not.toBeNull();
    });

    it('should render the large component on large screens', () => {
        const { queryByText } = render(
            <Responsive
                small={<Small />}
                medium={<Medium />}
                large={<Large />}
                width="lg"
            />
        );
        expect(queryByText('Small')).toBeNull();
        expect(queryByText('Medium')).toBeNull();
        expect(queryByText('Large')).not.toBeNull();
    });

    it('should render the medium component on large screens and large is null', () => {
        const { queryByText } = render(
            <Responsive small={<Small />} medium={<Medium />} width="lg" />
        );
        expect(queryByText('Small')).toBeNull();
        expect(queryByText('Medium')).not.toBeNull();
        expect(queryByText('Large')).toBeNull();
    });

    ['xs', 'sm', 'lg'].forEach(width => {
        it(`should render the small component on ${width} screens when no other component is passed`, () => {
            const { queryByText } = render(
                <Responsive small={<Small />} width={width} />
            );
            expect(queryByText('Small')).not.toBeNull();
            expect(queryByText('Medium')).toBeNull();
            expect(queryByText('Large')).toBeNull();
        });

        it(`should render the medium component on ${width} screens when no other component is passed`, () => {
            const { queryByText } = render(
                <Responsive medium={<Medium />} width={width} />
            );
            expect(queryByText('Small')).toBeNull();
            expect(queryByText('Medium')).not.toBeNull();
            expect(queryByText('Large')).toBeNull();
        });

        it(`should render the large component on ${width} screens when no other component is passed`, () => {
            const { queryByText } = render(
                <Responsive large={<Large />} width={width} />
            );
            expect(queryByText('Small')).toBeNull();
            expect(queryByText('Medium')).toBeNull();
            expect(queryByText('Large')).not.toBeNull();
        });
    });

    it('should fallback to the large component on medium screens', () => {
        const { queryByText } = render(
            <Responsive small={<Small />} large={<Large />} width="md" />
        );
        expect(queryByText('Small')).toBeNull();
        expect(queryByText('Medium')).toBeNull();
        expect(queryByText('Large')).not.toBeNull();
    });

    it('should fallback to the medium component on small screens', () => {
        const { queryByText } = render(
            <Responsive medium={<Medium />} large={<Large />} width="sm" />
        );
        expect(queryByText('Small')).toBeNull();
        expect(queryByText('Medium')).not.toBeNull();
        expect(queryByText('Large')).toBeNull();
    });

    it('should fallback to the medium component on large screens', () => {
        const { queryByText } = render(
            <Responsive small={<Small />} medium={<Medium />} width="lg" />
        );
        expect(queryByText('Small')).toBeNull();
        expect(queryByText('Medium')).not.toBeNull();
        expect(queryByText('Large')).toBeNull();
    });
});
