import React from 'react';
import expect from 'expect';
import { BooleanField } from './BooleanField';
import { render, cleanup } from '@testing-library/react';

const defaultProps = {
    record: { published: true },
    source: 'published',
    resource: 'posts',
    classes: {},
};

describe('<BooleanField />', () => {
    afterEach(cleanup);
    it('should display tick and truthy text if value is true', () => {
        const { queryByTitle } = render(<BooleanField {...defaultProps} />);
        expect(queryByTitle('ra.boolean.true')).not.toBeNull();
        expect(queryByTitle('ra.boolean.true').dataset.testid).toBe('true');
        expect(queryByTitle('ra.boolean.false')).toBeNull();
    });

    it('should use valueLabelTrue for custom truthy text', () => {
        const { queryByTitle } = render(
            <BooleanField
                {...defaultProps}
                valueLabelTrue="Has been published"
            />
        );
        expect(queryByTitle('ra.boolean.true')).toBeNull();
        expect(queryByTitle('Has been published')).not.toBeNull();
    });

    it('should display cross and falsy text if value is false', () => {
        const { queryByTitle } = render(
            <BooleanField {...defaultProps} record={{ published: false }} />
        );
        expect(queryByTitle('ra.boolean.true')).toBeNull();
        expect(queryByTitle('ra.boolean.false')).not.toBeNull();
        expect(queryByTitle('ra.boolean.false').dataset.testid).toBe('false');
    });

    it('should use valueLabelFalse for custom falsy text', () => {
        const { queryByTitle } = render(
            <BooleanField
                {...defaultProps}
                record={{ published: false }}
                valueLabelFalse="Has not been published"
            />
        );
        expect(queryByTitle('ra.boolean.false')).toBeNull();
        expect(queryByTitle('Has not been published')).not.toBeNull();
    });

    it('should not display anything if value is null', () => {
        const { queryByTitle } = render(
            <BooleanField {...defaultProps} record={{ published: null }} />
        );
        expect(queryByTitle('ra.boolean.true')).toBeNull();
        expect(queryByTitle('ra.boolean.false')).toBeNull();
    });

    it('should use custom className', () => {
        const { container } = render(
            <BooleanField
                {...defaultProps}
                record={{ foo: true }}
                className="foo"
            />
        );
        expect(container.firstChild.classList.contains('foo')).toBe(true);
    });

    it('should handle deep fields', () => {
        const { queryByTitle } = render(
            <BooleanField
                {...defaultProps}
                record={{ foo: { bar: true } }}
                source="foo.bar"
            />
        );
        expect(queryByTitle('ra.boolean.true')).not.toBeNull();
    });
});
