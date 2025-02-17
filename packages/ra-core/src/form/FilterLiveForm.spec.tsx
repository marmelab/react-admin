import { fireEvent, render, screen } from '@testing-library/react';
import { getFilterFormValues } from './FilterLiveForm';
import {
    Basic,
    GlobalValidation,
    MultipleFilterLiveForm,
    MultipleInput,
    ParseFormat,
    PerInputValidation,
} from './FilterLiveForm.stories';
import React from 'react';

describe('<FilterLiveForm />', () => {
    it('should allow to set a filter value', async () => {
        render(<Basic />);
        await screen.findByText('{"category":"deals"}');
        const input = await screen.findByLabelText('title');
        fireEvent.change(input, { target: { value: 'foo' } });
        await screen.findByText('{"category":"deals","title":"foo"}');
    });

    it('should allow to clear a filter value', async () => {
        render(<Basic />);
        const input = await screen.findByLabelText('title');
        fireEvent.change(input, { target: { value: 'foo' } });
        await screen.findByText('{"category":"deals","title":"foo"}');
        fireEvent.change(input, { target: { value: '' } });
        await screen.findByText('{"category":"deals"}');
    });

    it('should allow to clear a filter value with parse/format', async () => {
        render(<ParseFormat />);
        const input = await screen.findByLabelText('document');
        fireEvent.change(input, { target: { value: '123123123123' } });
        await screen.findByText(
            '{"category":"deals","document":"123123123123"}'
        );
        fireEvent.change(input, { target: { value: '' } });
        await screen.findByText('{"category":"deals"}');
    });

    it('should allow to clear a filter value through a clear button with parse/format', async () => {
        render(<ParseFormat />);
        const input = await screen.findByLabelText('document');
        fireEvent.change(input, { target: { value: '123123123123' } });
        await screen.findByText(
            '{"category":"deals","document":"123123123123"}'
        );
        fireEvent.click(screen.getByText('Clear'));
        await screen.findByText('{"category":"deals"}');
    });

    it('should support having multiple inputs', async () => {
        render(<MultipleInput />);
        await screen.findByText('{"category":"deals"}');
        const titleInput = await screen.findByLabelText('title');
        fireEvent.change(titleInput, { target: { value: 'foo' } });
        await screen.findByText('{"category":"deals","title":"foo"}');
        const authorInput = await screen.findByLabelText('author');
        fireEvent.change(authorInput, { target: { value: 'bar' } });
        await screen.findByText(
            '{"category":"deals","title":"foo","author":"bar"}'
        );
        fireEvent.change(titleInput, { target: { value: '' } });
        await screen.findByText('{"category":"deals","author":"bar"}');
    });

    it('should support having multiple FilterLiveForm', async () => {
        render(<MultipleFilterLiveForm />);
        await screen.findByText('{"category":"deals"}');
        const titleInput = await screen.findByLabelText('title');
        fireEvent.change(titleInput, { target: { value: 'foo' } });
        await screen.findByText('{"category":"deals","title":"foo"}');
        const authorInput = await screen.findByLabelText('author');
        fireEvent.change(authorInput, { target: { value: 'bar' } });
        await screen.findByText(
            '{"category":"deals","title":"foo","author":"bar"}'
        );
        fireEvent.change(titleInput, { target: { value: '' } });
        await screen.findByText('{"category":"deals","author":"bar"}');
    });

    it('should support per input validation', async () => {
        render(<PerInputValidation />);
        await screen.findByText('{"category":"deals","author":"Leo Tolstoy"}');
        const titleInput = await screen.findByLabelText('title');
        fireEvent.change(titleInput, { target: { value: 'foo' } });
        await screen.findByText(
            '{"category":"deals","author":"Leo Tolstoy","title":"foo"}'
        );
        const authorInput = await screen.findByLabelText('author');
        fireEvent.change(authorInput, { target: { value: '' } });
        await screen.findByText('@@react-admin@@"ra.validation.required"');
        await screen.findByText(
            '{"category":"deals","author":"Leo Tolstoy","title":"foo"}'
        );
        fireEvent.change(titleInput, { target: { value: 'new changes' } });
        // wait for debounce time to pass
        await new Promise(resolve => setTimeout(resolve, 510));
        await screen.findByText(
            '{"category":"deals","author":"Leo Tolstoy","title":"foo"}'
        );
        fireEvent.change(authorInput, { target: { value: 'valid' } });
        await screen.findByText(
            '{"category":"deals","author":"valid","title":"new changes"}'
        );
        expect(
            screen.queryByText('@@react-admin@@"ra.validation.required"')
        ).toBeNull();
    });

    it('should support global validation', async () => {
        render(<GlobalValidation />);
        await screen.findByText('{"category":"deals","author":"Leo Tolstoy"}');
        const titleInput = await screen.findByLabelText('title');
        fireEvent.change(titleInput, { target: { value: 'foo' } });
        await screen.findByText(
            '{"category":"deals","author":"Leo Tolstoy","title":"foo"}'
        );
        const authorInput = await screen.findByLabelText('author');
        fireEvent.change(authorInput, { target: { value: '' } });
        await screen.findByText('The author is required');
        await screen.findByText(
            '{"category":"deals","author":"Leo Tolstoy","title":"foo"}'
        );
        fireEvent.change(titleInput, { target: { value: 'new changes' } });
        // wait for debounce time to pass
        await new Promise(resolve => setTimeout(resolve, 510));
        await screen.findByText(
            '{"category":"deals","author":"Leo Tolstoy","title":"foo"}'
        );
        fireEvent.change(authorInput, { target: { value: 'valid' } });
        await screen.findByText(
            '{"category":"deals","author":"valid","title":"new changes"}'
        );
        expect(
            screen.queryByText('@@react-admin@@"ra.validation.required"')
        ).toBeNull();
    });

    describe('getFilterFormValues', () => {
        it('should correctly get the filter form values from the new filterValues', () => {
            const currentFormValues = {
                classicToClear: 'abc',
                nestedToClear: { nestedValue: 'def' },
                classicUpdated: 'ghi',
                nestedUpdated: { nestedValue: 'jkl' },
                nestedToSet: { nestedValue: undefined },
                published_at: new Date('2022-01-01T03:00:00.000Z'),
                clearedDateValue: null,
            };
            const newFilterValues = {
                classicUpdated: 'ghi2',
                nestedUpdated: { nestedValue: 'jkl2' },
                nestedToSet: { nestedValue: 'mno2' },
                published_at: '2022-01-01T03:00:00.000Z',
            };

            expect(
                getFilterFormValues(currentFormValues, newFilterValues)
            ).toEqual({
                classicToClear: '',
                nestedToClear: { nestedValue: '' },
                classicUpdated: 'ghi2',
                nestedUpdated: { nestedValue: 'jkl2' },
                nestedToSet: { nestedValue: 'mno2' },
                published_at: '2022-01-01T03:00:00.000Z',
                clearedDateValue: '',
            });
        });
    });
});
