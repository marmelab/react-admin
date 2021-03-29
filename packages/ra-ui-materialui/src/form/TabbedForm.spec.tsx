import * as React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
    minLength,
    required,
    SaveContextProvider,
    SideEffectContextProvider,
} from 'ra-core';
import { renderWithRedux } from 'ra-test';

import { TabbedForm } from './TabbedForm';
import { FormTab } from './FormTab';
import TextInput from '../input/TextInput';
import { fireEvent, isInaccessible } from '@testing-library/react';

describe('<TabbedForm />', () => {
    const saveContextValue = {
        save: jest.fn(),
        saving: false,
        setOnFailure: jest.fn(),
    };
    const sideEffectValue = {};

    it('should display the tabs', () => {
        const { queryAllByRole } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm>
                            <FormTab label="tab1" />
                            <FormTab label="tab2" />
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </MemoryRouter>
        );

        const tabs = queryAllByRole('tab');
        expect(tabs.length).toEqual(2);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const Toolbar = ({ submitOnEnter }: any) => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );

        const { queryByText, rerender } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm submitOnEnter={false} toolbar={<Toolbar />}>
                            <FormTab label="tab1" />
                            <FormTab label="tab2" />
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </MemoryRouter>
        );

        expect(queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <MemoryRouter initialEntries={['/']}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm submitOnEnter toolbar={<Toolbar />}>
                            <FormTab label="tab1" />
                            <FormTab label="tab2" />
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </MemoryRouter>
        );

        expect(queryByText('submitOnEnter: true')).not.toBeNull();
    });

    it('should set the style of an inactive Tab button with errors', async () => {
        const { getAllByRole, getByLabelText } = renderWithRedux(
            <MemoryRouter initialEntries={['/posts/1']} initialIndex={0}>
                <SaveContextProvider value={saveContextValue}>
                    <TabbedForm
                        classes={{ errorTabButton: 'error' }}
                        resource="posts"
                    >
                        <FormTab label="tab1">
                            <TextInput source="title" validate={required()} />
                        </FormTab>
                        <FormTab label="tab2">
                            <TextInput
                                source="description"
                                validate={minLength(10)}
                            />
                        </FormTab>
                    </TabbedForm>
                </SaveContextProvider>
            </MemoryRouter>
        );

        const tabs = getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = getByLabelText('resources.posts.fields.description');
        fireEvent.change(input, { target: { value: 'foo' } });
        fireEvent.blur(input);
        fireEvent.click(tabs[0]);
        expect(tabs[0].classList.contains('error')).toEqual(false);
        expect(tabs[1].classList.contains('error')).toEqual(true);
    });

    it('should set the style of an active Tab button with errors', () => {
        const { getAllByRole, getByLabelText } = renderWithRedux(
            <MemoryRouter initialEntries={['/posts/1']} initialIndex={0}>
                <SaveContextProvider value={saveContextValue}>
                    <TabbedForm
                        classes={{ errorTabButton: 'error' }}
                        resource="posts"
                    >
                        <FormTab label="tab1">
                            <TextInput source="title" validate={required()} />
                        </FormTab>
                        <FormTab label="tab2">
                            <TextInput
                                source="description"
                                validate={required()}
                            />
                        </FormTab>
                    </TabbedForm>
                </SaveContextProvider>
            </MemoryRouter>
        );

        const tabs = getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = getByLabelText('resources.posts.fields.description *');
        fireEvent.blur(input);
        expect(tabs[0].classList.contains('error')).toEqual(false);
        expect(tabs[1].classList.contains('error')).toEqual(true);
    });

    it('should set the style of any Tab button with errors on submit', () => {
        const { getAllByRole, getByLabelText } = renderWithRedux(
            <MemoryRouter initialEntries={['/posts/1']} initialIndex={0}>
                <SaveContextProvider value={saveContextValue}>
                    <TabbedForm
                        classes={{ errorTabButton: 'error' }}
                        resource="posts"
                    >
                        <FormTab label="tab1">
                            <TextInput source="title" validate={required()} />
                        </FormTab>
                        <FormTab label="tab2">
                            <TextInput
                                source="description"
                                validate={minLength(10)}
                            />
                        </FormTab>
                    </TabbedForm>
                </SaveContextProvider>
            </MemoryRouter>
        );

        const tabs = getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = getByLabelText('resources.posts.fields.description');
        fireEvent.blur(input);
        fireEvent.change(input, { target: { value: 'fooooooooo' } });
        fireEvent.click(getByLabelText('ra.action.save'));
        expect(tabs[0].classList.contains('error')).toEqual(true);
        expect(tabs[1].classList.contains('error')).toEqual(false);
    });

    it('should sync tabs with location by default', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });

        const { getAllByRole, getByLabelText } = renderWithRedux(
            <Router history={history}>
                <SaveContextProvider value={saveContextValue}>
                    <TabbedForm
                        classes={{ errorTabButton: 'error' }}
                        resource="posts"
                    >
                        <FormTab label="tab1">
                            <TextInput source="title" validate={required()} />
                        </FormTab>
                        <FormTab label="tab2">
                            <TextInput
                                source="description"
                                validate={minLength(10)}
                            />
                        </FormTab>
                    </TabbedForm>
                </SaveContextProvider>
            </Router>
        );

        const tabs = getAllByRole('tab');
        fireEvent.click(tabs[1]);
        expect(history.location.pathname).toEqual('/1');
        expect(
            getByLabelText('resources.posts.fields.description')
        ).not.toBeNull();
        expect(
            isInaccessible(getByLabelText('resources.posts.fields.title *'))
        ).toEqual(true);
        fireEvent.click(tabs[0]);
        expect(history.location.pathname).toEqual('/');
        expect(getByLabelText('resources.posts.fields.title *')).not.toBeNull();
        expect(
            isInaccessible(getByLabelText('resources.posts.fields.description'))
        ).toEqual(true);
    });

    it('should not sync tabs with location if syncWithLocation is false', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });

        const { getAllByRole, getByLabelText } = renderWithRedux(
            <Router history={history}>
                <SaveContextProvider value={saveContextValue}>
                    <TabbedForm
                        classes={{ errorTabButton: 'error' }}
                        resource="posts"
                        syncWithLocation={false}
                    >
                        <FormTab label="tab1">
                            <TextInput source="title" validate={required()} />
                        </FormTab>
                        <FormTab label="tab2">
                            <TextInput
                                source="description"
                                validate={minLength(10)}
                            />
                        </FormTab>
                    </TabbedForm>
                </SaveContextProvider>
            </Router>
        );

        const tabs = getAllByRole('tab');
        fireEvent.click(tabs[1]);
        expect(history.location.pathname).toEqual('/');
        expect(
            getByLabelText('resources.posts.fields.description')
        ).not.toBeNull();
        expect(
            isInaccessible(getByLabelText('resources.posts.fields.title *'))
        ).toEqual(true);
        fireEvent.click(tabs[0]);
        expect(history.location.pathname).toEqual('/');
        expect(getByLabelText('resources.posts.fields.title *')).not.toBeNull();
        expect(
            isInaccessible(getByLabelText('resources.posts.fields.description'))
        ).toEqual(true);
    });
});
