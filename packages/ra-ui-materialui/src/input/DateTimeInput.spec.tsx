import * as React from 'react';
import expect from 'expect';
import { fireEvent, waitFor } from '@testing-library/react';
import { required, FormWithRedirect } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import format from 'date-fns/format';
import { createTheme, ThemeProvider } from '@mui/material';

import { DateTimeInput } from './DateTimeInput';
import { ArrayInput, SimpleFormIterator } from './ArrayInput';

const theme = createTheme();

describe('<DateTimeInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'publishedAt',
    };

    it('should render a date time input', () => {
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => <DateTimeInput {...defaultProps} />}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.type).toBe('datetime-local');
    });

    it('should not make the form dirty on initialization', () => {
        const publishedAt = new Date().toISOString();
        let dirty;
        const { getByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                record={{ id: 1, publishedAt }}
                render={({ isDirty }) => {
                    dirty = isDirty;
                    return <DateTimeInput {...defaultProps} />;
                }}
            />
        );
        expect(getByDisplayValue(format(publishedAt, 'YYYY-MM-DDTHH:mm')));
        expect(dirty).toEqual(false);
    });

    // FIXME: Restore if we manage to manage to add defaultValue in ArrayInput
    it.skip('should display a default value inside an ArrayInput', () => {
        const date = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const backlinksDefaultValue = [
            {
                date,
            },
        ];
        const { getByDisplayValue } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <FormWithRedirect
                    save={jest.fn()}
                    render={() => {
                        return (
                            <ArrayInput
                                defaultValue={backlinksDefaultValue}
                                source="backlinks"
                            >
                                <SimpleFormIterator>
                                    <DateTimeInput source="date" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        );
                    }}
                />
            </ThemeProvider>
        );

        expect(getByDisplayValue(format(date, 'YYYY-MM-DDTHH:mm')));
        // expect(formApi.getState().values.backlinks[0].date).toEqual(
        //     new Date('2011-10-05T14:48:00.000Z')
        // );
    });

    it('should submit initial value with its timezone', async () => {
        let values;
        const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const save = jest.fn(formValues => {
            values = formValues;
        });
        const { getByText, queryByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                save={save}
                defaultValues={{ publishedAt }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DateTimeInput {...defaultProps} />
                        <button type="submit">Save</button>
                    </form>
                )}
            />
        );
        expect(
            queryByDisplayValue(format(publishedAt, 'YYYY-MM-DDTHH:mm'))
        ).not.toBeNull();
        fireEvent.click(getByText('Save'));

        await waitFor(() => {
            expect(values.publishedAt).toEqual(
                new Date('2011-10-05T14:48:00.000Z')
            );
        });
    });

    it('should submit default value on input with its timezone', async () => {
        let values;
        const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const save = jest.fn(formValues => {
            values = formValues;
        });
        const { getByText, queryByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                save={save}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DateTimeInput
                            {...defaultProps}
                            defaultValue={publishedAt}
                        />
                        <button type="submit">Save</button>
                    </form>
                )}
            />
        );
        expect(
            queryByDisplayValue(format(publishedAt, 'YYYY-MM-DDTHH:mm'))
        ).not.toBeNull();
        fireEvent.click(getByText('Save'));

        await waitFor(() => {
            expect(values.publishedAt).toEqual(
                new Date('2011-10-05T14:48:00.000Z')
            );
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    render={() => (
                        <DateTimeInput
                            {...defaultProps}
                            validate={required()}
                        />
                    )}
                />
            );
            expect(queryByText('ra.validation.required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            const { getByLabelText, queryByText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    mode="onBlur"
                    render={() => (
                        <DateTimeInput
                            {...defaultProps}
                            validate={required()}
                        />
                    )}
                />
            );
            const input = getByLabelText(
                'resources.posts.fields.publishedAt *'
            );
            input.focus();
            input.blur();

            await waitFor(() => {
                expect(queryByText('ra.validation.required')).not.toBeNull();
            });
        });
    });
});
