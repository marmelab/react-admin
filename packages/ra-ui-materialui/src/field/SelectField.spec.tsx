import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import {
    RecordContextProvider,
    TestTranslationProvider,
    useRecordContext,
    I18nContextProvider,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { SelectField } from './SelectField';

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

describe('<SelectField />', () => {
    const defaultProps = {
        source: 'foo' as const,
        choices: [
            { id: 0, name: 'hello' },
            { id: 1, name: 'world' },
        ],
    };

    it('should return null when the record is not set', () => {
        const { container } = render(<SelectField {...defaultProps} />);
        expect(container.firstChild).toBeNull();
    });

    it('should return null when the record has no value for the source', () => {
        const { container } = render(
            // @ts-expect-error source prop does not have a valid value
            <SelectField {...defaultProps} record={{ id: 123 }} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should return null when the record has a value for the source not in the choices', () => {
        const { container } = render(
            <SelectField {...defaultProps} record={{ id: 123, foo: 2 }} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render the emptyText when the value for the source is not in the choices', () => {
        render(
            <SelectField
                record={{ id: 123, foo: 2 }}
                emptyText="Option not found"
                {...defaultProps}
            />
        );
        expect(screen.queryByText('Option not found')).not.toBeNull();
    });

    it('should render the choice', () => {
        render(<SelectField {...defaultProps} record={{ id: 123, foo: 0 }} />);
        expect(screen.queryAllByText('hello')).toHaveLength(1);
    });

    it('should use record from RecordContext', () => {
        const record = { id: 123, foo: 0 };
        render(
            <RecordContextProvider value={record}>
                <SelectField {...defaultProps} />
            </RecordContextProvider>
        );
        expect(screen.queryByText('hello')).not.toBeNull();
    });

    it('should use custom className', () => {
        const { container } = render(
            <SelectField
                {...defaultProps}
                record={{ id: 123, foo: 1 }}
                className="lorem"
            />
        );
        expect(container.children[0].className).toContain('lorem');
    });

    it('should handle deep fields', () => {
        render(
            <SelectField
                {...defaultProps}
                source="foo.bar"
                record={{ id: 123, foo: { bar: 0 } }}
            />
        );
        expect(screen.queryAllByText('hello')).toHaveLength(1);
    });

    it('should use optionValue as value identifier', () => {
        render(
            <SelectField
                {...defaultProps}
                record={{ id: 123, foo: 0 }}
                optionValue="foobar"
                choices={[{ foobar: 0, name: 'hello' }]}
            />
        );
        expect(screen.queryAllByText('hello')).toHaveLength(1);
    });

    it('should use optionText with a string value as text identifier', () => {
        render(
            <SelectField
                {...defaultProps}
                record={{ id: 123, foo: 0 }}
                optionText="foobar"
                choices={[{ id: 0, foobar: 'hello' }]}
            />
        );
        expect(screen.queryAllByText('hello')).toHaveLength(1);
    });

    it('should use optionText with a function value as text identifier', () => {
        render(
            <SelectField
                {...defaultProps}
                record={{ id: 123, foo: 0 }}
                optionText={(choice: any) => choice.foobar}
                choices={[{ id: 0, foobar: 'hello' }]}
            />
        );
        expect(screen.queryAllByText('hello')).toHaveLength(1);
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = () => {
            const record = useRecordContext();
            return <span>{record?.foobar}</span>;
        };
        render(
            <SelectField
                {...defaultProps}
                record={{ id: 123, foo: 0 }}
                optionText={<Foobar />}
                choices={[{ id: 0, foobar: 'hello' }]}
            />
        );
        expect(screen.queryAllByText('hello')).toHaveLength(1);
    });

    it('should translate the choice by default', () => {
        render(
            <TestTranslationProvider messages={{ hello: 'bonjour' }}>
                <SelectField {...defaultProps} record={{ id: 123, foo: 0 }} />
            </TestTranslationProvider>
        );
        expect(screen.queryAllByText('hello')).toHaveLength(0);
        expect(screen.queryAllByText('bonjour')).toHaveLength(1);
    });

    it('should not translate the choice if translateChoice is false', () => {
        render(
            <TestTranslationProvider messages={{ hello: 'bonjour' }}>
                <SelectField
                    {...defaultProps}
                    record={{ id: 123, foo: 0 }}
                    translateChoice={false}
                />
            </TestTranslationProvider>
        );
        expect(screen.queryAllByText('hello')).toHaveLength(1);
        expect(screen.queryAllByText('bonjour')).toHaveLength(0);
    });

    it('should translate emptyText', () => {
        const { getByText } = render(
            <I18nContextProvider value={i18nProvider}>
                <SelectField
                    {...defaultProps}
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
