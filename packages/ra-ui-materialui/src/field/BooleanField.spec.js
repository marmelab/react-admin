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
        expect(queryByText('ra.boolean.true')).not.toBeNull();
        expect(getByRole('presentation').dataset.testid).toBe('true');
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
        expect(queryByText('ra.boolean.true')).toBeNull();
        expect(getByRole('presentation').dataset.testid).toBe('false');
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
