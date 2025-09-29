import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getFilterFormValues } from './FilterLiveForm';
import {
    Basic,
    GlobalValidation,
    MultipleFilterLiveForm,
    MultipleFilterLiveFormOverlapping,
    MultipleInput,
    ParseFormat,
    PerInputValidation,
    WithExternalChanges,
} from './FilterLiveForm.stories';
import React from 'react';
import { WithFilterListSection } from '../../../ra-ui-materialui/src/list/filter/FilterLiveForm.stories';

describe('<FilterLiveForm />', () => {
    it('should allow to set a filter value', async () => {
        render(<Basic />);
        await screen.findByText('{"category":"deals"}');
        const input = await screen.findByLabelText('title');
        fireEvent.change(input, { target: { value: 'foo' } });
        await screen.findByText('{"category":"deals","title":"foo"}');
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    it('should work when users type at the exact same pace than the debounce delay', async () => {
        render(
            <Basic
                ListBaseProps={{ debounce: 100 }}
                FilterLiveFormProps={{ debounce: 100 }}
            />
        );
        const input = await screen.findByLabelText('title');
        await userEvent.type(input, 'foo', {
            delay: 100,
        });
        screen.getByDisplayValue('foo');
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

    it('should not reapply old filter values when they change externally', async () => {
        render(<WithFilterListSection />);
        // Click on Yes
        fireEvent.click(await screen.findByText('Yes'));
        await screen.findByText('"has_newsletter": true', { exact: false });
        await new Promise(resolve => setTimeout(resolve, 510));
        await screen.findByText('"has_newsletter": true', { exact: false });
        // Click on No
        fireEvent.click(await screen.findByText('No'));
        await screen.findByText('"has_newsletter": false', { exact: false });
        await new Promise(resolve => setTimeout(resolve, 510));
        await screen.findByText('"has_newsletter": false', { exact: false });
        // Click on Yes
        fireEvent.click(await screen.findByText('Yes'));
        await screen.findByText('"has_newsletter": true', { exact: false });
        await new Promise(resolve => setTimeout(resolve, 510));
        await screen.findByText('"has_newsletter": true', { exact: false });
        // Click on No
        fireEvent.click(await screen.findByText('No'));
        await screen.findByText('"has_newsletter": false', { exact: false });
        await new Promise(resolve => setTimeout(resolve, 510));
        await screen.findByText('"has_newsletter": false', { exact: false });
    });

    it('should not reapply old externally applied filters after clear', async () => {
        render(<WithExternalChanges />);
        // Set filter body: foo
        fireEvent.change(await screen.findByLabelText('body'), {
            target: { value: 'foo' },
        });
        fireEvent.click(await screen.findByText('Apply filter'));
        await waitFor(() => {
            expect(
                JSON.parse(
                    screen.queryByTestId('filter-values')?.textContent || ''
                )
            ).toEqual({
                body: 'foo',
            });
        });
        // Unmount
        fireEvent.click(await screen.findByLabelText('Mount/unmount'));
        await waitFor(() => {
            expect(screen.queryByText('External list')).toBeNull();
        });
        // Mount
        fireEvent.click(await screen.findByLabelText('Mount/unmount'));
        await screen.findByText('External list');
        expect(
            JSON.parse(screen.queryByTestId('filter-values')?.textContent || '')
        ).toEqual({
            body: 'foo',
        });
        // Clear filters
        fireEvent.click(await screen.findByText('Clear filters'));
        await waitFor(() => {
            expect(
                JSON.parse(
                    screen.queryByTestId('filter-values')?.textContent || ''
                )
            ).toEqual({});
        });
        // Wait for a bit
        await new Promise(resolve => setTimeout(resolve, 510));
        expect(
            JSON.parse(screen.queryByTestId('filter-values')?.textContent || '')
        ).toEqual({});
    });

    it('should not reapply old filter values when changing another FilterLiveForm', async () => {
        render(<MultipleFilterLiveFormOverlapping />);
        // Set first body input to foo
        fireEvent.change((await screen.findAllByLabelText('body'))[0], {
            target: { value: 'foo' },
        });
        await waitFor(() => {
            expect(
                JSON.parse(
                    screen.queryByTestId('filter-values')?.textContent || ''
                )
            ).toEqual({
                category: 'deals',
                body: 'foo',
            });
        });
        // Clear first body input
        fireEvent.change((await screen.findAllByLabelText('body'))[0], {
            target: { value: '' },
        });
        await waitFor(() => {
            expect(
                JSON.parse(
                    screen.queryByTestId('filter-values')?.textContent || ''
                )
            ).toEqual({
                category: 'deals',
            });
        });
        // Change author input
        fireEvent.change(await screen.findByLabelText('author'), {
            target: { value: 'bar' },
        });
        await waitFor(() => {
            expect(
                JSON.parse(
                    screen.queryByTestId('filter-values')?.textContent || ''
                )
            ).toEqual({
                // body should not reappear
                category: 'deals',
                author: 'bar',
            });
        });
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
                newIgnoredValue: 'pqr',
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
