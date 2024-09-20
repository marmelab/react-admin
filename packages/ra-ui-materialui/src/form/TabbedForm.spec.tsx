import * as React from 'react';

import {
    minLength,
    required,
    ResourceContextProvider,
    testDataProvider,
    TestMemoryRouter,
} from 'ra-core';

import {
    fireEvent,
    isInaccessible,
    render,
    screen,
    waitFor,
} from '@testing-library/react';

import { AdminContext } from '../AdminContext';
import { TabbedForm } from './TabbedForm';
import { TabbedFormClasses } from './TabbedFormView';
import { TextInput } from '../input';
import { EncodedPaths } from './TabbedForm.stories';

describe('<TabbedForm />', () => {
    it('should display the tabs', () => {
        render(
            <TestMemoryRouter>
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <TabbedForm>
                            <TabbedForm.Tab label="tab1" />
                            <TabbedForm.Tab label="tab2" />
                        </TabbedForm>
                    </ResourceContextProvider>
                </AdminContext>
            </TestMemoryRouter>
        );

        const tabs = screen.queryAllByRole('tab');
        expect(tabs.length).toEqual(2);
    });

    it('should display the tabs contents with encoded complex record identifiers', async () => {
        render(<EncodedPaths />);

        const tabs = await screen.findAllByRole('tab');
        expect(tabs.length).toEqual(2);
        await screen.findByLabelText('Title');
    });

    it('should set the style of an inactive Tab button with errors', async () => {
        render(
            <TestMemoryRouter initialEntries={['/1']}>
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <TabbedForm mode="onBlur">
                            <TabbedForm.Tab label="tab1">
                                <TextInput
                                    defaultValue=""
                                    source="title"
                                    validate={required()}
                                />
                            </TabbedForm.Tab>
                            <TabbedForm.Tab label="tab2">
                                <TextInput
                                    defaultValue=""
                                    source="description"
                                    validate={minLength(10)}
                                />
                            </TabbedForm.Tab>
                        </TabbedForm>
                    </ResourceContextProvider>
                </AdminContext>
            </TestMemoryRouter>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = screen.getByLabelText(
            'resources.posts.fields.description'
        );
        fireEvent.change(input, { target: { value: 'foo' } });
        fireEvent.blur(input);
        fireEvent.click(tabs[0]);

        await waitFor(() => {
            expect(
                tabs[1].classList.contains(TabbedFormClasses.errorTabButton)
            ).toEqual(true);
        });

        expect(
            tabs[0].classList.contains(TabbedFormClasses.errorTabButton)
        ).toEqual(false);
    });

    it('should set the style of an active Tab button with errors', async () => {
        render(
            <TestMemoryRouter initialEntries={['/1']}>
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <TabbedForm mode="onBlur">
                            <TabbedForm.Tab label="tab1">
                                <TextInput
                                    defaultValue=""
                                    source="title"
                                    validate={required()}
                                />
                            </TabbedForm.Tab>
                            <TabbedForm.Tab label="tab2">
                                <TextInput
                                    defaultValue=""
                                    source="description"
                                    validate={required()}
                                />
                            </TabbedForm.Tab>
                        </TabbedForm>
                    </ResourceContextProvider>
                </AdminContext>
            </TestMemoryRouter>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = screen.getByLabelText(
            'resources.posts.fields.description *'
        );
        fireEvent.blur(input);
        await waitFor(() => {
            expect(
                tabs[1].classList.contains(TabbedFormClasses.errorTabButton)
            ).toEqual(true);
        });
        expect(
            tabs[0].classList.contains(TabbedFormClasses.errorTabButton)
        ).toEqual(false);
    });

    it('should set the style of any Tab button with errors on submit', async () => {
        render(
            <TestMemoryRouter initialEntries={['/1']}>
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <TabbedForm mode="onBlur">
                            <TabbedForm.Tab label="tab1">
                                <TextInput
                                    defaultValue=""
                                    source="title"
                                    validate={required()}
                                />
                            </TabbedForm.Tab>
                            <TabbedForm.Tab label="tab2">
                                <TextInput
                                    defaultValue=""
                                    source="description"
                                    validate={minLength(10)}
                                />
                            </TabbedForm.Tab>
                        </TabbedForm>
                    </ResourceContextProvider>
                </AdminContext>
            </TestMemoryRouter>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = screen.getByLabelText(
            'resources.posts.fields.description'
        );
        fireEvent.change(input, { target: { value: 'fooooooooo' } });
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(
                tabs[0].classList.contains(TabbedFormClasses.errorTabButton)
            ).toEqual(true);
        });
        expect(
            tabs[1].classList.contains(TabbedFormClasses.errorTabButton)
        ).toEqual(false);
    });

    it('should sync tabs with location by default', () => {
        let location;
        render(
            <TestMemoryRouter
                initialEntries={['/']}
                locationCallback={l => {
                    location = l;
                }}
            >
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <TabbedForm>
                            <TabbedForm.Tab label="tab1">
                                <TextInput
                                    defaultValue=""
                                    source="title"
                                    validate={required()}
                                />
                            </TabbedForm.Tab>
                            <TabbedForm.Tab label="tab2">
                                <TextInput
                                    defaultValue=""
                                    source="description"
                                    validate={minLength(10)}
                                />
                            </TabbedForm.Tab>
                        </TabbedForm>
                    </ResourceContextProvider>
                </AdminContext>
            </TestMemoryRouter>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        expect(location.pathname).toEqual('/1');
        expect(
            screen.getByLabelText('resources.posts.fields.description')
        ).not.toBeNull();
        expect(
            isInaccessible(
                screen.getByLabelText('resources.posts.fields.title *')
            )
        ).toEqual(true);
        fireEvent.click(tabs[0]);
        expect(location.pathname).toEqual('/');
        expect(
            screen.getByLabelText('resources.posts.fields.title *')
        ).not.toBeNull();
        expect(
            isInaccessible(
                screen.getByLabelText('resources.posts.fields.description')
            )
        ).toEqual(true);
    });

    it('should not sync tabs with location if syncWithLocation is false', () => {
        let location;
        render(
            <TestMemoryRouter
                initialEntries={['/']}
                locationCallback={l => {
                    location = l;
                }}
            >
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <TabbedForm syncWithLocation={false}>
                            <TabbedForm.Tab label="tab1">
                                <TextInput
                                    source="title"
                                    validate={required()}
                                />
                            </TabbedForm.Tab>
                            <TabbedForm.Tab label="tab2">
                                <TextInput
                                    source="description"
                                    validate={minLength(10)}
                                />
                            </TabbedForm.Tab>
                        </TabbedForm>
                    </ResourceContextProvider>
                </AdminContext>
            </TestMemoryRouter>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        expect(location.pathname).toEqual('/');
        expect(
            screen.getByLabelText('resources.posts.fields.description')
        ).not.toBeNull();
        expect(
            isInaccessible(
                screen.getByLabelText('resources.posts.fields.title *')
            )
        ).toEqual(true);
        fireEvent.click(tabs[0]);
        expect(location.pathname).toEqual('/');
        expect(
            screen.getByLabelText('resources.posts.fields.title *')
        ).not.toBeNull();
        expect(
            isInaccessible(
                screen.getByLabelText('resources.posts.fields.description')
            )
        ).toEqual(true);
    });

    it('should not warn for `toolbar` prop of type `false`', () => {
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        render(
            <TestMemoryRouter initialEntries={['/']}>
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <TabbedForm toolbar={false}>
                            <TabbedForm.Tab label="tab1"></TabbedForm.Tab>
                        </TabbedForm>
                    </ResourceContextProvider>
                </AdminContext>
            </TestMemoryRouter>
        );

        expect(consoleSpy).not.toBeCalledWith(
            'Warning: Failed %s type: %s%s',
            'prop',
            expect.stringContaining('Invalid prop `toolbar` of type `boolean`'),
            expect.stringContaining(`at ${TabbedForm.name}`)
        );
    });
});
