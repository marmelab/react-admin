import * as React from 'react';
import expect from 'expect';
import BooleanField from './BooleanField';
import { render } from '@testing-library/react';
import { RecordContextProvider } from 'ra-core';

const defaultProps = {
    record: { id: 123, published: true },
    source: 'published',
    resource: 'posts',
    classes: {},
};

describe('<BooleanField />', () => {
    it('should display tick and truthy text if value is true', () => {
        const { queryByLabelText } = render(<BooleanField {...defaultProps} />);
        expect(queryByLabelText('ra.boolean.true')).not.toBeNull();
        expect(
            (queryByLabelText('ra.boolean.true').firstChild as HTMLElement)
                .dataset.testid
        ).toBe('true');
        expect(queryByLabelText('ra.boolean.false')).toBeNull();
    });

    it('should use record from RecordContext', () => {
        const { queryByLabelText } = render(
            <RecordContextProvider value={{ id: 123, published: true }}>
                <BooleanField source="published" />
            </RecordContextProvider>
        );
        expect(queryByLabelText('ra.boolean.true')).not.toBeNull();
        expect(
            (queryByLabelText('ra.boolean.true').firstChild as HTMLElement)
                .dataset.testid
        ).toBe('true');
        expect(queryByLabelText('ra.boolean.false')).toBeNull();
    });

    it('should use valueLabelTrue for custom truthy text', () => {
        const { queryByLabelText } = render(
            <BooleanField
                {...defaultProps}
                valueLabelTrue="Has been published"
            />
        );
        expect(queryByLabelText('ra.boolean.true')).toBeNull();
        expect(queryByLabelText('Has been published')).not.toBeNull();
    });

    it('should display cross and falsy text if value is false', () => {
        const { queryByLabelText } = render(
            <BooleanField
                {...defaultProps}
                record={{ id: 123, published: false }}
            />
        );
        expect(queryByLabelText('ra.boolean.true')).toBeNull();
        expect(queryByLabelText('ra.boolean.false')).not.toBeNull();
        expect(
            (queryByLabelText('ra.boolean.false').firstChild as HTMLElement)
                .dataset.testid
        ).toBe('false');
    });

    it('should use valueLabelFalse for custom falsy text', () => {
        const { queryByLabelText } = render(
            <BooleanField
                {...defaultProps}
                record={{ id: 123, published: false }}
                valueLabelFalse="Has not been published"
            />
        );
        expect(queryByLabelText('ra.boolean.false')).toBeNull();
        expect(queryByLabelText('Has not been published')).not.toBeNull();
    });

    it('should not display anything if value is null', () => {
        const { queryByLabelText } = render(
            <BooleanField
                {...defaultProps}
                record={{ id: 123, published: null }}
            />
        );
        expect(queryByLabelText('ra.boolean.true')).toBeNull();
        expect(queryByLabelText('ra.boolean.false')).toBeNull();
    });

    it('should display tick and truthy text if looseValue is true and value is truthy', () => {
        const defaultProps = {
            record: { id: 123, published: 1 },
            source: 'published',
            resource: 'posts',
            classes: {},
        };
        const { queryByLabelText } = render(
            <BooleanField {...defaultProps} looseValue />
        );
        expect(queryByLabelText('ra.boolean.true')).not.toBeNull();
        expect(
            (queryByLabelText('ra.boolean.true').firstChild as HTMLElement)
                .dataset.testid
        ).toBe('true');
        expect(queryByLabelText('ra.boolean.false')).toBeNull();
    });

    it('should display cross and falsy text if looseValue is true and value is falsy', () => {
        const defaultProps = {
            record: { id: 123, published: 0 },
            source: 'published',
            resource: 'posts',
            classes: {},
        };

        const { queryByLabelText } = render(
            <BooleanField {...defaultProps} looseValue />
        );
        expect(queryByLabelText('ra.boolean.false')).not.toBeNull();
        expect(
            (queryByLabelText('ra.boolean.false').firstChild as HTMLElement)
                .dataset.testid
        ).toBe('false');
        expect(queryByLabelText('ra.boolean.true')).toBeNull();
    });

    it.each([null, undefined])(
        'should display the emptyText when is present and the value is %s',
        published => {
            const { queryByLabelText, queryByText } = render(
                <BooleanField
                    {...defaultProps}
                    record={{ id: 123, published }}
                    emptyText="NA"
                />
            );
            expect(queryByLabelText('ra.boolean.true')).toBeNull();
            expect(queryByLabelText('ra.boolean.false')).toBeNull();
            expect(queryByText('NA')).not.toBeNull();
        }
    );

    it('should use custom className', () => {
        const { container } = render(
            <BooleanField
                {...defaultProps}
                record={{ id: 123, foo: true }}
                className="foo"
            />
        );
        expect(container.children[0].classList.contains('foo')).toBe(true);
    });

    it('should handle deep fields', () => {
        const { queryByLabelText } = render(
            <BooleanField
                {...defaultProps}
                record={{ id: 123, foo: { bar: true } }}
                source="foo.bar"
            />
        );
        expect(queryByLabelText('ra.boolean.true')).not.toBeNull();
    });
});
