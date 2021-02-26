import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import useChoices from './useChoices';
import { renderWithRedux } from 'ra-test';
import { TestTranslationProvider } from '../i18n';

describe('useChoices hook', () => {
    const defaultProps = {
        choice: { id: 42, name: 'test' },
        optionValue: 'id',
        optionText: 'name',
        translateChoice: true,
    };

    const Component = ({
        choice,
        optionText,
        optionValue,
        translateChoice,
    }) => {
        const { getChoiceText, getChoiceValue } = useChoices({
            optionText,
            optionValue,
            translateChoice,
        });

        return (
            <div data-value={getChoiceValue(choice)}>
                {getChoiceText(choice)}
            </div>
        );
    };

    it('should use optionValue as value identifier', () => {
        const { getByText } = render(<Component {...defaultProps} />);
        expect(getByText('test').getAttribute('data-value')).toEqual('42');
    });

    it('should use optionText with a string value as text identifier', () => {
        const { queryAllByText } = render(<Component {...defaultProps} />);
        expect(queryAllByText('test')).toHaveLength(1);
    });

    it('should use optionText with a function value as text identifier', () => {
        const { queryAllByText } = render(
            <Component
                {...defaultProps}
                optionText={choice => choice.foobar}
                choice={{ id: 42, foobar: 'test' }}
            />
        );
        expect(queryAllByText('test')).toHaveLength(1);
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }: { record?: any }) => (
            <span>{record.foobar}</span>
        );
        const { queryAllByText } = render(
            <Component
                {...defaultProps}
                optionText={<Foobar />}
                choice={{ id: 42, foobar: 'test' }}
            />
        );
        expect(queryAllByText('test')).toHaveLength(1);
    });

    it('should translate the choice by default', () => {
        const { queryAllByText } = renderWithRedux(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Component {...defaultProps} />
            </TestTranslationProvider>
        );
        expect(queryAllByText('test')).toHaveLength(0);
        expect(queryAllByText('**test**')).toHaveLength(1);
    });

    it('should not translate the choice if translateChoice is false', () => {
        const { queryAllByText } = renderWithRedux(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Component {...defaultProps} translateChoice={false} />
            </TestTranslationProvider>
        );
        expect(queryAllByText('test')).toHaveLength(1);
        expect(queryAllByText('**test**')).toHaveLength(0);
    });
});
