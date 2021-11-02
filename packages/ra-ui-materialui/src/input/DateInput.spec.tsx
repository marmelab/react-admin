import * as React from 'react';
import expect from 'expect';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { required, FormWithRedirect } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import format from 'date-fns/format';

import { DateInput } from './DateInput';

describe('<DateInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'publishedAt',
    };

    it('should render a date input', () => {
        renderWithRedux(
            <FormWithRedirect
                save={jest.fn}
                render={() => <DateInput {...defaultProps} />}
            />
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.type).toBe('date');
    });

    it('should accept a date string as value', async () => {
        const save = jest.fn();
        renderWithRedux(
            <FormWithRedirect
                save={save}
                defaultValues={{ publishedAt: '2021-09-11' }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DateInput {...defaultProps} />
                        <button type="submit">Save</button>
                    </form>
                )}
            />
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        userEvent.type(input, '2021-10-22');
        expect(input.value).toBe('2021-10-22');
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(save).toHaveBeenCalledWith({ publishedAt: '2021-10-22' });
        });
    });

    it('should accept a date time string as value', async () => {
        const save = jest.fn();

        renderWithRedux(
            <FormWithRedirect
                save={save}
                defaultValues={{ publishedAt: '2021-09-11T06:51:17.772Z' }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DateInput {...defaultProps} />
                        <button type="submit">Save</button>
                    </form>
                )}
            />
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');

        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(save).toHaveBeenCalledWith({
                publishedAt: '2021-09-11T06:51:17.772Z',
            });
        });
        userEvent.type(input, '2021-10-22');

        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(save).toHaveBeenCalledWith({
                publishedAt: '2021-10-22',
            });
        });
    });

    it('should accept a date object as value', async () => {
        const save = jest.fn();

        renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                defaultValues={{ publishedAt: new Date('2021-09-11') }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DateInput {...defaultProps} />
                        <button type="submit">Save</button>
                    </form>
                )}
            />
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(save).toHaveBeenCalledWith({
                publishedAt: new Date('2021-09-11'),
            });
        });
        userEvent.type(input, '2021-10-22');

        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(save).toHaveBeenCalledWith({
                publishedAt: '2021-10-22',
            });
        });
    });

    it('should accept a parse function', () => {
        let formApi;
        renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                defaultValues={{ publishedAt: new Date('2021-09-11') }}
                render={({ form }) => {
                    formApi = form;
                    return (
                        <DateInput
                            {...defaultProps}
                            parse={val => new Date(val)}
                        />
                    );
                }}
            />
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        expect(formApi.getState().values.publishedAt).toEqual(
            new Date('2021-09-11')
        );
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        expect(formApi.getState().values.publishedAt).toEqual(
            new Date('2021-10-22')
        );
    });

    it('should accept a parse function returning null', () => {
        let formApi;
        renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                defaultValues={{ publishedAt: new Date('2021-09-11') }}
                render={({ form }) => {
                    formApi = form;
                    return <DateInput {...defaultProps} parse={val => null} />;
                }}
            />
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        expect(formApi.getState().values.publishedAt).toEqual(
            new Date('2021-09-11')
        );
        fireEvent.change(input, {
            target: { value: '' },
        });
        // Uncommenting this line makes the test fail, cf https://github.com/marmelab/react-admin/issues/6573
        // fireEvent.blur(input);
        expect(formApi.getState().values.publishedAt).toBeNull();
    });

    it('should not make the form dirty on initialization', () => {
        const publishedAt = new Date().toISOString();
        let formApi: FormApi;
        renderWithRedux(
            <FormWithRedirect
                save={jest.fn}
                record={{ id: 1, publishedAt }}
                render={({ form }) => {
                    formApi = form;
                    return <DateInput {...defaultProps} />;
                }}
            />
        );
        expect(screen.getByDisplayValue(format(publishedAt, 'YYYY-MM-DD')));
        expect(formApi.getState().dirty).toEqual(false);
    });

    it('should call `input.onChange` method when changed', () => {
        let formApi;
        renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={({ form }) => {
                    formApi = form;
                    return <DateInput {...defaultProps} />;
                }}
            />
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        );
        fireEvent.change(input, {
            target: { value: '2010-01-04' },
        });
        expect(formApi.getState().values.publishedAt).toEqual('2010-01-04');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            renderWithRedux(
                <FormWithRedirect
                    save={jest.fn}
                    render={() => (
                        <DateInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            expect(screen.queryByText('ra.validation.required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            renderWithRedux(
                <FormWithRedirect
                    save={jest.fn}
                    render={() => (
                        <>
                            <DateInput
                                {...defaultProps}
                                validate={required()}
                            />
                            <button type="submit">Save</button>
                        </>
                    )}
                />
            );
            fireEvent.click(screen.getByText('Save'));
            waitFor(() => {
                expect(
                    screen.queryByText('ra.validation.required')
                ).not.toBeNull();
            });
        });
    });
});
