import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';

import { useChoices } from './useChoices';
import { TestTranslationProvider } from '../i18n';
import { useRecordContext } from '../controller';

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
        render(<Component {...defaultProps} />);
        expect(screen.getByText('test').getAttribute('data-value')).toEqual(
            '42'
        );
    });

    it('should use optionText with a string value as text identifier', () => {
        render(<Component {...defaultProps} />);
        expect(screen.queryAllByText('test')).toHaveLength(1);
    });

    it('should use optionText with a function value as text identifier', () => {
        render(
            <Component
                {...defaultProps}
                optionText={choice => choice.foobar}
                choice={{ id: 42, foobar: 'test' }}
            />
        );
        expect(screen.queryAllByText('test')).toHaveLength(1);
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = () => {
            const record = useRecordContext();
            return <span>{record.foobar}</span>;
        };
        render(
            <Component
                {...defaultProps}
                optionText={<Foobar />}
                choice={{ id: 42, foobar: 'test' }}
            />
        );
        expect(screen.queryAllByText('test')).toHaveLength(1);
    });

    it('should translate the choice by default', () => {
        render(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Component {...defaultProps} />
            </TestTranslationProvider>
        );
        expect(screen.queryAllByText('test')).toHaveLength(0);
        expect(screen.queryAllByText('**test**')).toHaveLength(1);
    });

    it('should not translate the choice if translateChoice is false', () => {
        render(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Component {...defaultProps} translateChoice={false} />
            </TestTranslationProvider>
        );
        expect(screen.queryAllByText('test')).toHaveLength(1);
        expect(screen.queryAllByText('**test**')).toHaveLength(0);
    });
});
