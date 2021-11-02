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
        let values = {};
        const save = jest.fn(formValues => {
            values = formValues;
        });
        renderWithRedux(
            <>
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
                <p>{JSON.stringify(values)}</p>
            </>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        userEvent.type(input, '2021-10-22');
        expect(input.value).toBe('2021-10-22');
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(screen.queryAllByText('2021-10-22')).not.toBeNull();
        });
    });

    it('should accept a date time string as value', async () => {
        let values = {};
        const save = jest.fn(formValues => {
            values = formValues;
        });

        renderWithRedux(
            <>
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
                <p>{JSON.stringify(values)}</p>
            </>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');

        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(
                screen.queryAllByText('2021-09-11T06:51:17.772Z')
            ).not.toBeNull();
        });
        userEvent.type(input, '2021-10-22');

        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(screen.queryAllByText('2021-10-22')).not.toBeNull();
        });
    });

    it('should accept a date object as value', async () => {
        let values = {};
        const save = jest.fn(formValues => {
            values = formValues;
        });

        renderWithRedux(
            <>
                <FormWithRedirect
                    save={save}
                    defaultValues={{ publishedAt: new Date('2021-09-11') }}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DateInput {...defaultProps} />
                            <button type="submit">Save</button>
                        </form>
                    )}
                />
                <p>{JSON.stringify(values)}</p>
            </>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(
                screen.queryAllByText(new Date('2021-09-11').toISOString())
            ).not.toBeNull();
        });
        userEvent.type(input, '2021-10-22');

        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(screen.queryAllByText('2021-10-22')).not.toBeNull();
        });
    });

    it('should accept a parse function', async () => {
        let values = {};
        const save = jest.fn(formValues => {
            values = formValues;
        });
        renderWithRedux(
            <>
                <FormWithRedirect
                    save={save}
                    defaultValues={{ publishedAt: new Date('2021-09-11') }}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DateInput
                                {...defaultProps}
                                parse={val => new Date(val)}
                            />
                            <button type="submit">Save</button>
                        </form>
                    )}
                />
                <p>{JSON.stringify(values)}</p>
            </>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(
                screen.queryAllByText(new Date('2021-10-22').toISOString())
            ).not.toBeNull();
        });
    });

    it('should accept a parse function returning null', async () => {
        let values = {};
        const save = jest.fn(formValues => {
            values = formValues;
        });
        renderWithRedux(
            <>
                <FormWithRedirect
                    save={save}
                    defaultValues={{ publishedAt: new Date('2021-09-11') }}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DateInput {...defaultProps} parse={val => null} />
                            <button type="submit">Save</button>
                        </form>
                    )}
                />
                <p>{JSON.stringify(values)}</p>
            </>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '' },
        });
        await waitFor(() => {
            expect(screen.queryAllByText('null')).not.toBeNull();
        });
    });

    it('should not make the form dirty on initialization', () => {
        const publishedAt = new Date().toISOString();
        let dirty;
        renderWithRedux(
            <FormWithRedirect
                save={jest.fn}
                record={{ id: 1, publishedAt }}
                render={({ handleSubmit, isDirty }) => {
                    dirty = isDirty;
                    return <DateInput {...defaultProps} />;
                }}
            />
        );
        expect(screen.getByDisplayValue(format(publishedAt, 'YYYY-MM-DD')));
        expect(dirty).toEqual(false);
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
