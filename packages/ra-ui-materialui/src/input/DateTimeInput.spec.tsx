import * as React from 'react';
import expect from 'expect';
import { render, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { required, FormWithRedirect } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import format from 'date-fns/format';
import { ThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';

import DateTimeInput from './DateTimeInput';
import { ArrayInput, SimpleFormIterator } from './ArrayInput';
import { FormApi } from 'final-form';

const theme = createTheme();

describe('<DateTimeInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'publishedAt',
    };

    it('should render a date time input', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
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
        let formApi: FormApi;
        const { getByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                onSubmit={jest.fn}
                record={{ id: 1, publishedAt }}
                render={({ form }) => {
                    formApi = form;
                    return <DateTimeInput {...defaultProps} />;
                }}
            />
        );
        expect(getByDisplayValue(format(publishedAt, 'YYYY-MM-DDTHH:mm')));
        expect(formApi.getState().dirty).toEqual(false);
    });

    it('should display a default value inside an ArrayInput', () => {
        const date = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const backlinksDefaultValue = [
            {
                date,
            },
        ];
        let formApi: FormApi;
        const { getByDisplayValue } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <FormWithRedirect
                    onSubmit={jest.fn}
                    render={({ form }) => {
                        formApi = form;
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
        expect(formApi.getState().values.backlinks[0].date).toEqual(
            new Date('2011-10-05T14:48:00.000Z')
        );
    });

    it('should submit initial value with its timezone', () => {
        let formApi;
        const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const onSubmit = jest.fn();
        const { queryByDisplayValue } = renderWithRedux(
            <Form
                onSubmit={onSubmit}
                initialValues={{ publishedAt }}
                render={({ form }) => {
                    formApi = form;

                    return <DateTimeInput {...defaultProps} />;
                }}
            />
        );
        expect(
            queryByDisplayValue(format(publishedAt, 'YYYY-MM-DDTHH:mm'))
        ).not.toBeNull();
        expect(formApi.getState().values.publishedAt).toEqual(
            new Date('2011-10-05T14:48:00.000Z')
        );
    });

    it('should submit default value on input with its timezone', () => {
        let formApi;
        const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const onSubmit = jest.fn();
        const { queryByDisplayValue } = renderWithRedux(
            <Form
                onSubmit={onSubmit}
                render={({ form }) => {
                    formApi = form;

                    return (
                        <DateTimeInput
                            {...defaultProps}
                            defaultValue={publishedAt}
                        />
                    );
                }}
            />
        );
        expect(
            queryByDisplayValue(format(publishedAt, 'YYYY-MM-DDTHH:mm'))
        ).not.toBeNull();
        expect(formApi.getState().values.publishedAt).toEqual(
            new Date('2011-10-05T14:48:00.000Z')
        );
    });

    it('should call `input.onChange` method when changed', () => {
        let formApi;
        const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={({ form }) => {
                    formApi = form;
                    return <DateTimeInput {...defaultProps} />;
                }}
            />
        );
        const input = getByLabelText('resources.posts.fields.publishedAt');
        fireEvent.change(input, {
            target: { value: format(publishedAt, 'YYYY-MM-DDTHH:mm') },
        });
        expect(formApi.getState().values.publishedAt).toEqual(
            new Date('2011-10-05T14:48:00.000Z')
        );
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn}
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

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    validateOnBlur
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
            expect(queryByText('ra.validation.required')).not.toBeNull();
        });
    });
});
