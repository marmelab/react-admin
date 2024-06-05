import * as React from 'react';
import expect from 'expect';
import { BooleanField } from './BooleanField';
import { screen, render } from '@testing-library/react';
import { RecordContextProvider, I18nContextProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const defaultProps = {
    record: { id: 123, published: true },
    source: 'published' as const,
    resource: 'posts',
    classes: {},
};

const i18nProvider = polyglotI18nProvider(
    _locale =>
        ({
            resources: {
                books: {
                    name: 'Books',
                    fields: {
                        id: 'Id',
                        title: 'Title',
                        author: 'Author',
                        year: 'Year',
                    },
                    not_found: 'Not found',
                },
            },
        }) as any,
    'en'
);

describe('<BooleanField />', () => {
    it('should display tick and truthy text if value is true', () => {
        render(<BooleanField {...defaultProps} />);
        expect(screen.queryByLabelText('ra.boolean.true')).not.toBeNull();
        expect(screen.queryByLabelText('ra.boolean.true')?.dataset.testid).toBe(
            'true'
        );
        expect(screen.queryByLabelText('ra.boolean.false')).toBeNull();
    });

    it('should use record from RecordContext', () => {
        render(
            <RecordContextProvider value={{ id: 123, published: true }}>
                <BooleanField source="published" />
            </RecordContextProvider>
        );
        expect(screen.queryByLabelText('ra.boolean.true')).not.toBeNull();
        expect(screen.queryByLabelText('ra.boolean.true')?.dataset.testid).toBe(
            'true'
        );
        expect(screen.queryByLabelText('ra.boolean.false')).toBeNull();
    });

    it('should use valueLabelTrue for custom truthy text', () => {
        render(
            <BooleanField
                {...defaultProps}
                valueLabelTrue="Has been published"
            />
        );
        expect(screen.queryByLabelText('ra.boolean.true')).toBeNull();
        expect(screen.queryByLabelText('Has been published')).not.toBeNull();
    });

    it('should display cross and falsy text if value is false', () => {
        render(
            <BooleanField
                {...defaultProps}
                record={{ id: 123, published: false }}
            />
        );
        expect(screen.queryByLabelText('ra.boolean.true')).toBeNull();
        expect(screen.queryByLabelText('ra.boolean.false')).not.toBeNull();
        expect(
            screen.queryByLabelText('ra.boolean.false')?.dataset.testid
        ).toBe('false');
    });

    it('should use valueLabelFalse for custom falsy text', () => {
        render(
            <BooleanField
                {...defaultProps}
                record={{ id: 123, published: false }}
                valueLabelFalse="Has not been published"
            />
        );
        expect(screen.queryByLabelText('ra.boolean.false')).toBeNull();
        expect(
            screen.queryByLabelText('Has not been published')
        ).not.toBeNull();
    });

    it('should not display anything if value is null', () => {
        render(
            <BooleanField
                {...defaultProps}
                record={{ id: 123, published: null }}
            />
        );
        expect(screen.queryByLabelText('ra.boolean.true')).toBeNull();
        expect(screen.queryByLabelText('ra.boolean.false')).toBeNull();
    });

    it('should display tick and truthy text if looseValue is true and value is truthy', () => {
        const defaultProps = {
            record: { id: 123, published: 1 },
            source: 'published' as const,
            resource: 'posts',
            classes: {},
        };
        render(<BooleanField {...defaultProps} looseValue />);
        expect(screen.queryByLabelText('ra.boolean.true')).not.toBeNull();
        expect(screen.queryByLabelText('ra.boolean.true')?.dataset.testid).toBe(
            'true'
        );
        expect(screen.queryByLabelText('ra.boolean.false')).toBeNull();
    });

    it('should display cross and falsy text if looseValue is true and value is falsy', () => {
        const defaultProps = {
            record: { id: 123, published: 0 },
            source: 'published' as const,
            resource: 'posts',
            classes: {},
        };

        render(<BooleanField {...defaultProps} looseValue />);
        expect(screen.queryByLabelText('ra.boolean.false')).not.toBeNull();
        expect(
            screen.queryByLabelText('ra.boolean.false')?.dataset.testid
        ).toBe('false');
        expect(screen.queryByLabelText('ra.boolean.true')).toBeNull();
    });

    it.each([null, undefined])(
        'should display the emptyText when is present and the value is %s',
        published => {
            render(
                <BooleanField
                    {...defaultProps}
                    record={{ id: 123, published }}
                    emptyText="NA"
                />
            );
            expect(screen.queryByLabelText('ra.boolean.true')).toBeNull();
            expect(screen.queryByLabelText('ra.boolean.false')).toBeNull();
            expect(screen.queryByText('NA')).not.toBeNull();
        }
    );

    it('should use custom className', () => {
        const { container } = render(
            // @ts-expect-error source prop does not have a valid value
            <BooleanField
                {...defaultProps}
                record={{ id: 123, foo: true }}
                className="foo"
            />
        );
        expect(container.children[0].classList.contains('foo')).toBe(true);
    });

    it('should handle deep fields', () => {
        render(
            <BooleanField
                {...defaultProps}
                record={{ id: 123, foo: { bar: true } }}
                source="foo.bar"
            />
        );
        expect(screen.queryByLabelText('ra.boolean.true')).not.toBeNull();
    });

    it('should translate emptyText', () => {
        const { getByText } = render(
            <I18nContextProvider value={i18nProvider}>
                <BooleanField
                    record={{ id: 123 }}
                    // @ts-expect-error source prop does not have a valid value
                    source="foo.bar"
                    emptyText="resources.books.not_found"
                />
            </I18nContextProvider>
        );

        expect(getByText('Not found')).not.toBeNull();
    });
});
