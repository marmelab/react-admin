import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ResourceContextProvider, testDataProvider } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { ImageInput } from './ImageInput';
import { ImageField } from '../field';

describe('<ImageInput />', () => {
    const defaultProps = {
        source: 'image',
    };

    const defaultPropsMultiple = {
        source: 'images',
        resource: 'posts',
        multiple: true,
    };

    it('should display a dropzone for single file dropping', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <ImageInput {...defaultProps}>
                            <div />
                        </ImageInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(
            screen.queryByText('ra.input.image.upload_single')
        ).not.toBeNull();
    });

    it('should display a dropzone for multiple files dropping', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <ImageInput {...defaultProps} multiple>
                            <div />
                        </ImageInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(
            screen.queryByText('ra.input.image.upload_several')
        ).not.toBeNull();
    });

    // Skipped until https://github.com/jsdom/jsdom/issues/1568 is fixed
    it.skip('should correctly update upon drop when allowing a single file', async () => {
        const onSubmit = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{
                            image: undefined,
                        }}
                    >
                        <ImageInput {...defaultProps}>
                            <div />
                        </ImageInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const file = createFile('cats.gif', 1234, 'image/gif');
        fireEvent.drop(
            screen.getByTestId('dropzone'),
            createDataTransfer([file])
        );
        // Required because react-dropzone handle drag & drop operations asynchronously
        await new Promise(resolve => setTimeout(resolve));

        fireEvent.click(screen.getByLabelText('ra.action.save'));

        expect(onSubmit.mock.calls[0][0]).toEqual({
            images: [
                {
                    src: 'cats.gif',
                },
            ],
        });
    });

    // Skipped until https://github.com/jsdom/jsdom/issues/1568 is fixed
    it.skip('should correctly update upon drop when allowing multiple files', async () => {
        const onSubmit = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        defaultValues={{
                            images: [],
                        }}
                        onSubmit={onSubmit}
                    >
                        <ImageInput {...defaultPropsMultiple}>
                            <div />
                        </ImageInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const file1 = createFile('cats.gif', 1234, 'image/gif');
        const file2 = createFile('cats2.gif', 1234, 'image/gif');
        fireEvent.drop(
            screen.getByTestId('dropzone'),
            createDataTransfer([file1, file2])
        );
        // Required because react-dropzone handle drag & drop operations asynchronously
        await new Promise(resolve => setTimeout(resolve));

        fireEvent.click(screen.getByLabelText('ra.action.save'));

        expect(onSubmit.mock.calls[0][0]).toEqual({
            images: [
                {
                    src: 'cats.gif',
                },
                {
                    src: 'cats2.gif',
                },
            ],
        });
    });

    it('should correctly update upon removal when allowing a single file', async () => {
        const onSubmit = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        defaultValues={{
                            image: {
                                src: 'test.png',
                                title: 'cats',
                            },
                        }}
                        onSubmit={onSubmit}
                    >
                        <ImageInput {...defaultProps}>
                            <ImageField source="src" title="title" />
                        </ImageInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(screen.getByTitle('cats')).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.delete'));
        fireEvent.click(screen.getByLabelText('ra.action.save'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    image: null,
                },
                expect.anything()
            );
        });
    });

    it('should correctly update upon removal when allowing multiple file (removing first file)', async () => {
        const onSubmit = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        defaultValues={{
                            images: [
                                {
                                    src: 'test.png',
                                    title: 'cats',
                                },
                                {
                                    src: 'test2.png',
                                    title: 'cats2',
                                },
                            ],
                        }}
                        onSubmit={onSubmit}
                    >
                        <ImageInput {...defaultPropsMultiple}>
                            <ImageField source="src" title="title" />
                        </ImageInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(screen.getByTitle('cats')).not.toBeNull();
        fireEvent.click(screen.getAllByLabelText('ra.action.delete')[0]);
        fireEvent.click(screen.getByLabelText('ra.action.save'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    images: [
                        {
                            src: 'test2.png',
                            title: 'cats2',
                        },
                    ],
                },
                expect.anything()
            );
        });
    });

    it('should correctly update upon removal when allowing multiple files (removing second file)', async () => {
        const onSubmit = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        defaultValues={{
                            images: [
                                {
                                    src: 'test.png',
                                    title: 'cats',
                                },
                                {
                                    src: 'test2.png',
                                    title: 'cats 2',
                                },
                            ],
                        }}
                        onSubmit={onSubmit}
                    >
                        <ImageInput {...defaultPropsMultiple}>
                            <ImageField source="src" title="title" />
                        </ImageInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(screen.getByTitle('cats')).not.toBeNull();
        expect(screen.getByTitle('cats 2')).not.toBeNull();
        fireEvent.click(screen.getAllByLabelText('ra.action.delete')[1]);
        fireEvent.click(screen.getByLabelText('ra.action.save'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    images: [
                        {
                            src: 'test.png',
                            title: 'cats',
                        },
                    ],
                },
                expect.anything()
            );
        });
    });

    it('should display correct custom label', () => {
        const test = (expectedLabel, expectedLabelText = expectedLabel) => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <ImageInput
                                {...defaultProps}
                                placeholder={expectedLabel}
                            >
                                <div />
                            </ImageInput>
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            expect(screen.getByText(expectedLabelText)).not.toBeNull();
        };

        const CustomLabel = () => <div>Custom label in component</div>;
        test('custom label');
        test(<h1>Custom label</h1>, 'Custom label');
        test(<CustomLabel />, 'Custom label in component');
    });

    describe('Image Preview', () => {
        it('should display file preview using child as preview component', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{
                                image: {
                                    url: 'http://foo.com/bar.jpg',
                                    title: 'Hello world!',
                                },
                            }}
                        >
                            <ImageInput {...defaultProps} source="image">
                                <ImageField source="url" title="title" />
                            </ImageInput>
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const previewImage = screen.queryByTitle('Hello world!');
            expect(previewImage).not.toBeNull();
            expect(previewImage.getAttribute('src')).toEqual(
                'http://foo.com/bar.jpg'
            );
        });

        it('should display all files (when several) previews using child as preview component', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{
                                images: [
                                    {
                                        url: 'http://foo.com/bar.jpg',
                                        title: 'Hello world!',
                                    },
                                    {
                                        url: 'http://foo.com/qux.bmp',
                                        title: 'A good old Bitmap!',
                                    },
                                ],
                            }}
                        >
                            <ImageInput {...defaultPropsMultiple}>
                                <ImageField source="url" title="title" />
                            </ImageInput>
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const previewImage1 = screen.queryByTitle('Hello world!');
            expect(previewImage1).not.toBeNull();
            expect(previewImage1.getAttribute('src')).toEqual(
                'http://foo.com/bar.jpg'
            );

            const previewImage2 = screen.queryByTitle('A good old Bitmap!');
            expect(previewImage2).not.toBeNull();
            expect(previewImage2.getAttribute('src')).toEqual(
                'http://foo.com/qux.bmp'
            );
        });

        it('should update previews when updating input value', () => {
            const { rerender } = render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            record={{
                                image: {
                                    title: 'Hello world!',
                                    url: 'http://static.acme.com/foo.jpg',
                                },
                            }}
                        >
                            <ImageInput {...defaultProps} source="image">
                                <ImageField source="url" title="title" />
                            </ImageInput>
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const previewImage = screen.queryByTitle('Hello world!');
            expect(previewImage).not.toBeNull();
            expect(previewImage.getAttribute('src')).toEqual(
                'http://static.acme.com/foo.jpg'
            );

            rerender(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            record={{
                                image: {
                                    title: 'Hello world!',
                                    url: 'http://static.acme.com/bar.jpg',
                                },
                            }}
                        >
                            <ImageInput {...defaultProps} source="image">
                                <ImageField source="url" title="title" />
                            </ImageInput>
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const updatedPreviewImage = screen.queryByTitle('Hello world!');
            expect(updatedPreviewImage).not.toBeNull();
            expect(updatedPreviewImage.getAttribute('src')).toEqual(
                'http://static.acme.com/bar.jpg'
            );
        });

        // Skipped until https://github.com/jsdom/jsdom/issues/1568 is fixed
        it.skip('should update previews when dropping a file', async () => {
            const onSubmit = jest.fn();

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            defaultValues={{
                                images: [],
                            }}
                            onSubmit={onSubmit}
                        >
                            <ImageInput {...defaultPropsMultiple}>
                                <ImageField source="url" />
                            </ImageInput>
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const file = createFile('cats.gif', 1234, 'image/gif');
            fireEvent.drop(
                screen.getByTestId('dropzone'),
                createDataTransfer([file])
            );
            // Required because react-dropzone handle drag & drop operations asynchronously
            await new Promise(resolve => setTimeout(resolve));

            const previewImage = screen.queryByRole('image');
            expect(previewImage).not.toBeNull();
            expect(previewImage.getAttribute('src')).toMatch(/blob:.*/);
        });
    });
});

const createDataTransfer = (files = []) => ({
    dataTransfer: {
        files,
        items: files.map(file => ({
            kind: 'file',
            type: file.type,
            getAsFile: () => file,
        })),
        types: ['Files'],
    },
});

const createFile = (name, size, type) => {
    const file = new File([], name, { type });
    Object.defineProperty(file, 'size', {
        get() {
            return size;
        },
    });
    return file;
};
