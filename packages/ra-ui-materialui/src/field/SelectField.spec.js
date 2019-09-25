import React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';

import { TestTranslationProvider, renderWithRedux } from 'ra-core';
import { SelectField } from './SelectField';

describe('<SelectField />', () => {
    afterEach(cleanup);

    const defaultProps = {
        source: 'foo',
        choices: [{ id: 0, name: 'hello' }, { id: 1, name: 'world' }],
    };

    it('should return null when the record is not set', () => {
        const { container } = render(<SelectField {...defaultProps} />);
        expect(container.firstChild).toBeNull();
    });

    it('should return null when the record has no value for the source', () => {
        const { container } = render(
            <SelectField {...defaultProps} record={{}} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should return null when the record has a value for the source not in the choices', () => {
        const { container } = render(
            <SelectField {...defaultProps} record={{ foo: 2 }} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render the choice', () => {
        const { queryAllByText } = render(
            <SelectField {...defaultProps} record={{ foo: 0 }} />
        );
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should use custom className', () => {
        const { container } = render(
            <SelectField
                {...defaultProps}
                record={{ foo: 1 }}
                className="lorem"
            />
        );
        expect(container.firstChild.className).toContain('lorem');
    });

    it('should handle deep fields', () => {
        const { queryAllByText } = render(
            <SelectField
                {...defaultProps}
                source="foo.bar"
                record={{ foo: { bar: 0 } }}
            />
        );
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should use optionValue as value identifier', () => {
        const { queryAllByText } = render(
            <SelectField
                {...defaultProps}
                record={{ foo: 0 }}
                optionValue="foobar"
                choices={[{ foobar: 0, name: 'hello' }]}
            />
        );
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should use optionText with a string value as text identifier', () => {
        const { queryAllByText } = render(
            <SelectField
                {...defaultProps}
                record={{ foo: 0 }}
                optionText="foobar"
                choices={[{ id: 0, foobar: 'hello' }]}
            />
        );
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should use optionText with a function value as text identifier', () => {
        const { queryAllByText } = render(
            <SelectField
                {...defaultProps}
                record={{ foo: 0 }}
                optionText={choice => choice.foobar}
                choices={[{ id: 0, foobar: 'hello' }]}
            />
        );
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => <span>{record.foobar}</span>;
        const { queryAllByText } = render(
            <SelectField
                {...defaultProps}
                record={{ foo: 0 }}
                optionText={<Foobar />}
                choices={[{ id: 0, foobar: 'hello' }]}
            />
        );
        expect(queryAllByText('hello')).toHaveLength(1);
    });

    it('should translate the choice by default', () => {
        const { queryAllByText } = renderWithRedux(
            <TestTranslationProvider messages={{ hello: 'bonjour' }}>
                <SelectField {...defaultProps} record={{ foo: 0 }} />
            </TestTranslationProvider>
        );
        expect(queryAllByText('hello')).toHaveLength(0);
        expect(queryAllByText('bonjour')).toHaveLength(1);
    });

    it('should not translate the choice if translateChoice is false', () => {
        const { queryAllByText } = renderWithRedux(
            <TestTranslationProvider messages={{ hello: 'bonjour' }}>
                <SelectField
                    {...defaultProps}
                    record={{ foo: 0 }}
                    translateChoice={false}
                />
            </TestTranslationProvider>
        );
        expect(queryAllByText('hello')).toHaveLength(1);
        expect(queryAllByText('bonjour')).toHaveLength(0);
    });
});
