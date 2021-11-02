import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { FormWithRedirect } from 'ra-core';
import { renderWithRedux } from 'ra-test';

import { ImageInput } from './ImageInput';
import { ImageField } from '../field';

describe('<ImageInput />', () => {
    const defaultProps = {
        source: 'image',
        resource: 'posts',
    };

    const defaultPropsMultiple = {
        source: 'images',
        resource: 'posts',
        multiple: true,
    };

    it('should display a dropzone for single file dropping', () => {
        const { queryByText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <ImageInput {...defaultProps}>
                        <div />
                    </ImageInput>
                )}
            />
        );

        expect(queryByText('ra.input.image.upload_single')).not.toBeNull();
    });

    it('should display a dropzone for multiple files dropping', () => {
        const { queryByText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <ImageInput {...defaultProps} multiple>
                        <div />
                    </ImageInput>
                )}
            />
        );

        expect(queryByText('ra.input.image.upload_several')).not.toBeNull();
    });

    // Skipped until https://github.com/jsdom/jsdom/issues/1568 is fixed
    it.skip('should correctly update upon drop when allowing a single file', async () => {
        const onSubmit = jest.fn();

        const { getByTestId, getByLabelText } = renderWithRedux(
            <FormWithRedirect
                defaultValues={{
                    image: undefined,
                }}
                save={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ImageInput {...defaultProps}>
                            <div />
                        </ImageInput>
                        <button type="submit" aria-label="Save" />
                    </form>
                )}
            />
        );

        const file = createFile('cats.gif', 1234, 'image/gif');
        fireEvent.drop(getByTestId('dropzone'), createDataTransfer([file]));
        // Required because react-dropzone handle drag & drop operations asynchronously
        await new Promise(resolve => setImmediate(resolve));

        fireEvent.click(getByLabelText('Save'));

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

        const { getByTestId, getByLabelText } = renderWithRedux(
            <FormWithRedirect
                defaultValues={{
                    images: [],
                }}
                save={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ImageInput {...defaultPropsMultiple}>
                            <div />
                        </ImageInput>
                        <button type="submit" aria-label="Save" />
                    </form>
                )}
            />
        );

        const file1 = createFile('cats.gif', 1234, 'image/gif');
        const file2 = createFile('cats2.gif', 1234, 'image/gif');
        fireEvent.drop(
            getByTestId('dropzone'),
            createDataTransfer([file1, file2])
        );
        // Required because react-dropzone handle drag & drop operations asynchronously
        await new Promise(resolve => setImmediate(resolve));

        fireEvent.click(getByLabelText('Save'));

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

        const { getByLabelText, getByTitle } = renderWithRedux(
            <FormWithRedirect
                defaultValues={{
                    image: {
                        src: 'test.png',
                        title: 'cats',
                    },
                }}
                save={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ImageInput {...defaultProps}>
                            <ImageField source="src" title="title" />
                        </ImageInput>
                        <button type="submit" aria-label="Save" />
                    </form>
                )}
            />
        );

        expect(getByTitle('cats')).not.toBeNull();
        fireEvent.click(getByLabelText('ra.action.delete'));
        fireEvent.click(getByLabelText('Save'));

        await waitFor(() => {
            expect(onSubmit.mock.calls[0][0]).toEqual({
                image: null,
            });
        });
    });

    it('should correctly update upon removal when allowing multiple file (removing first file)', async () => {
        const onSubmit = jest.fn();

        const {
            getByLabelText,
            getAllByLabelText,
            getByTitle,
        } = renderWithRedux(
            <FormWithRedirect
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
                save={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ImageInput {...defaultPropsMultiple}>
                            <ImageField source="src" title="title" />
                        </ImageInput>
                        <button type="submit" aria-label="Save" />
                    </form>
                )}
            />
        );

        expect(getByTitle('cats')).not.toBeNull();
        fireEvent.click(getAllByLabelText('ra.action.delete')[0]);
        fireEvent.click(getByLabelText('Save'));

        await waitFor(() => {
            expect(onSubmit.mock.calls[0][0]).toEqual({
                images: [
                    {
                        src: 'test2.png',
                        title: 'cats2',
                    },
                ],
            });
        });
    });

    it('should correctly update upon removal when allowing multiple files (removing second file)', async () => {
        const onSubmit = jest.fn();

        const {
            getAllByLabelText,
            getByLabelText,
            getByTitle,
        } = renderWithRedux(
            <FormWithRedirect
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
                save={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ImageInput {...defaultPropsMultiple}>
                            <ImageField source="src" title="title" />
                        </ImageInput>
                        <button type="submit" aria-label="Save" />
                    </form>
                )}
            />
        );

        expect(getByTitle('cats')).not.toBeNull();
        expect(getByTitle('cats 2')).not.toBeNull();
        fireEvent.click(getAllByLabelText('ra.action.delete')[1]);
        fireEvent.click(getByLabelText('Save'));

        await waitFor(() => {
            expect(onSubmit.mock.calls[0][0]).toEqual({
                images: [
                    {
                        src: 'test.png',
                        title: 'cats',
                    },
                ],
            });
        });
    });

    it('should display correct custom label', () => {
        const test = (expectedLabel, expectedLabelText = expectedLabel) => {
            const { getByText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    render={() => (
                        <ImageInput
                            {...defaultProps}
                            placeholder={expectedLabel}
                        >
                            <div />
                        </ImageInput>
                    )}
                />
            );

            expect(getByText(expectedLabelText)).not.toBeNull();
        };

        const CustomLabel = () => <div>Custom label in component</div>;
        test('custom label');
        test(<h1>Custom label</h1>, 'Custom label');
        test(<CustomLabel />, 'Custom label in component');
    });

    describe('Image Preview', () => {
        it('should display file preview using child as preview component', () => {
            const { queryByTitle } = renderWithRedux(
                <FormWithRedirect
                    defaultValues={{
                        image: {
                            url: 'http://foo.com/bar.jpg',
                            title: 'Hello world!',
                        },
                    }}
                    save={jest.fn()}
                    render={() => (
                        <ImageInput {...defaultProps} source="image">
                            <ImageField source="url" title="title" />
                        </ImageInput>
                    )}
                />
            );

            const previewImage = queryByTitle('Hello world!');
            expect(previewImage).not.toBeNull();
            expect(previewImage.getAttribute('src')).toEqual(
                'http://foo.com/bar.jpg'
            );
        });

        it('should display all files (when several) previews using child as preview component', () => {
            const { queryByTitle } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
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
                    render={() => (
                        <ImageInput {...defaultPropsMultiple}>
                            <ImageField source="url" title="title" />
                        </ImageInput>
                    )}
                />
            );

            const previewImage1 = queryByTitle('Hello world!');
            expect(previewImage1).not.toBeNull();
            expect(previewImage1.getAttribute('src')).toEqual(
                'http://foo.com/bar.jpg'
            );

            const previewImage2 = queryByTitle('A good old Bitmap!');
            expect(previewImage2).not.toBeNull();
            expect(previewImage2.getAttribute('src')).toEqual(
                'http://foo.com/qux.bmp'
            );
        });

        // Skipped until https://github.com/jsdom/jsdom/issues/1568 is fixed
        it.skip('should update previews when updating input value', () => {
            const { queryByTitle, getByTestId } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    defaultValues={{
                        image: {
                            title: 'Hello world!',
                            url: 'http://static.acme.com/foo.jpg',
                        },
                    }}
                    render={() => (
                        <ImageInput {...defaultProps} source="image">
                            <ImageField source="url" title="title" />
                        </ImageInput>
                    )}
                />
            );

            const previewImage = queryByTitle('Hello world!');
            expect(previewImage).not.toBeNull();
            expect(previewImage.getAttribute('src')).toEqual(
                'http://static.acme.com/foo.jpg'
            );

            const file = createFile(
                'http://static.acme.com/bar.jpg',
                1234,
                'image/jpeg'
            );
            fireEvent.drop(getByTestId('dropzone'), createDataTransfer([file]));

            const updatedPreviewImage = queryByTitle('Hello world!');
            expect(updatedPreviewImage).not.toBeNull();
            expect(updatedPreviewImage.getAttribute('src')).toEqual(
                'http://static.acme.com/bar.jpg'
            );
        });

        // Skipped until https://github.com/jsdom/jsdom/issues/1568 is fixed
        it.skip('should update previews when dropping a file', async () => {
            const onSubmit = jest.fn();

            const { getByTestId, queryByRole } = renderWithRedux(
                <FormWithRedirect
                    defaultValues={{
                        images: [],
                    }}
                    save={onSubmit}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <ImageInput {...defaultPropsMultiple}>
                                <ImageField source="url" />
                            </ImageInput>
                            <button type="submit" aria-label="Save" />
                        </form>
                    )}
                />
            );

            const file = createFile('cats.gif', 1234, 'image/gif');
            fireEvent.drop(getByTestId('dropzone'), createDataTransfer([file]));
            // Required because react-dropzone handle drag & drop operations asynchronously
            await new Promise(resolve => setImmediate(resolve));

            const previewImage = queryByRole('image');
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
