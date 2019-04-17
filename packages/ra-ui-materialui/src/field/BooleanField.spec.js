import React from 'react';
import expect from 'expect';
import { BooleanField } from './BooleanField';
import { render, cleanup } from 'react-testing-library';

describe('<BooleanField />', () => {
    afterEach(cleanup);
    it('should display tick and truthy text if value is true', () => {
        const { queryByText, getByRole } = render(
            <BooleanField
                record={{ published: true }}
                source="published"
                resource="posts"
            />
        );
        expect(getByRole('presentation').children[1].getAttribute('d')).toBe(
            'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z'
        );
        expect(queryByText('ra.boolean.true')).not.toBeNull();
        expect(queryByText('ra.boolean.false')).toBeNull();
    });

    it('should use valueLabelTrue for custom truthy text', () => {
        const { queryByText } = render(
            <BooleanField
                record={{ published: true }}
                source="published"
                resource="posts"
                valueLabelTrue="Has been published"
            />
        );
        expect(queryByText('ra.boolean.true')).toBeNull();
        expect(queryByText('Has been published')).not.toBeNull();
    });

    it('should display cross and falsy text if value is false', () => {
        const { queryByText, getByRole } = render(
            <BooleanField
                record={{ published: false }}
                source="published"
                resource="posts"
            />
        );
        expect(getByRole('presentation').children[0].getAttribute('d')).toBe(
            'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
        );
        expect(queryByText('ra.boolean.true')).toBeNull();
        expect(queryByText('ra.boolean.false')).not.toBeNull();
    });

    it('should use valueLabelFalse for custom falsy text', () => {
        const { queryByText } = render(
            <BooleanField
                record={{ published: false }}
                source="published"
                resource="posts"
                valueLabelFalse="Has not been published"
            />
        );
        expect(queryByText('ra.boolean.false')).toBeNull();
        expect(queryByText('Has not been published')).not.toBeNull();
    });

    it('should not display anything if value is null', () => {
        const { queryByText } = render(
            <BooleanField record={{ published: null }} source="published" />
        );
        expect(queryByText('ra.boolean.true')).toBeNull();
        expect(queryByText('ra.boolean.false')).toBeNull();
    });

    it('should use custom className', () => {
        const { container } = render(
            <BooleanField record={{ foo: true }} source="foo" className="foo" />
        );
        expect(container.firstChild.classList.contains('foo')).toBe(true);
    });

    it('should handle deep fields', () => {
        const { queryByText } = render(
            <BooleanField record={{ foo: { bar: true } }} source="foo.bar" />
        );
        expect(queryByText('ra.boolean.true')).not.toBeNull();
    });
});
