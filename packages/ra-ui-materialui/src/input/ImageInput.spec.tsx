import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';

import ImageField from '../field/ImageField';
import ImageInput from './ImageInput';

describe('<ImageInput />', () => {
    afterEach(cleanup);

    const defautProps = {
        source: 'image',
        resource: 'posts',
    };

    const defautPropsMultiple = {
        source: 'images',
        resource: 'posts',
        multiple: true,
    };

    it('should display a dropzone for single file dropping', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ImageInput {...defautProps}>
                        <div />
                    </ImageInput>
                )}
            />
        );

        expect(queryByText('ra.input.image.upload_single')).not.toBeNull();
    });

    it('should display a dropzone for multiple files dropping', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ImageInput {...defautProps} multiple>
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

        const { getByTestId, getByLabelText } = render(
            <Form
                initialValues={{
                    image: undefined,
                }}
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ImageInput {...defautProps}>
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

        const { getByTestId, getByLabelText } = render(
            <Form
                initialValues={{
                    images: [],
                }}
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ImageInput {...defautPropsMultiple}>
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

    it('should correctly update upon removal when allowing a single file', () => {
        const onSubmit = jest.fn();

        const { getByLabelText, getByTitle } = render(
            <Form
                initialValues={{
                    image: {
                        src: 'test.png',
                        title: 'cats',
                    },
                }}
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ImageInput {...defautProps}>
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

        expect(onSubmit.mock.calls[0][0]).toEqual({
            image: null,
        });
    });

    it('should correctly update upon removal when allowing multiple file (removing first file)', () => {
        const onSubmit = jest.fn();

        const { getByLabelText, getAllByLabelText, getByTitle } = render(
            <Form
                initialValues={{
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
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ImageInput {...defautPropsMultiple}>
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

        expect(onSubmit.mock.calls[0][0]).toEqual({
            images: [
                {
                    src: 'test2.png',
                    title: 'cats2',
                },
            ],
        });
    });

    it('should correctly update upon removal when allowing multiple files (removing second file)', () => {
        const onSubmit = jest.fn();

        const { getAllByLabelText, getByLabelText, getByTitle } = render(
            <Form
                initialValues={{
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
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <ImageInput {...defautPropsMultiple}>
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

        expect(onSubmit.mock.calls[0][0]).toEqual({
            images: [
                {
                    src: 'test.png',
                    title: 'cats',
                },
            ],
        });
    });

    it('should display correct custom label', () => {
        const test = (expectedLabel, expectedLabelText = expectedLabel) => {
            const { getByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <ImageInput
                            {...defautProps}
                            placeholder={expectedLabel}
                        >
                            <div />
                        </ImageInput>
                    )}
                />
            );

            expect(getByText(expectedLabelText)).not.toBeNull();
            cleanup();
        };

        const CustomLabel = () => <div>Custom label in component</div>;
        test('custom label');
        test(<h1>Custom label</h1>, 'Custom label');
        test(<CustomLabel />, 'Custom label in component');
    });

    describe('Image Preview', () => {
        it('should display file preview using child as preview component', () => {
            const { queryByTitle } = render(
                <Form
                    initialValues={{
                        image: {
                            url: 'http://foo.com/bar.jpg',
                            title: 'Hello world!',
                        },
                    }}
                    onSubmit={jest.fn()}
                    render={() => (
                        <ImageInput {...defautProps} source="image">
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
            const { queryByTitle } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{
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
                        <ImageInput {...defautPropsMultiple}>
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

        it('should update previews when updating input value', () => {
            const { queryByTitle, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{
                        image: {
                            title: 'Hello world!',
                            url: 'http://static.acme.com/foo.jpg',
                        },
                    }}
                    render={() => (
                        <ImageInput {...defautProps} source="image">
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

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{
                        image: {
                            title: 'Hello world!',
                            url: 'http://static.acme.com/bar.jpg',
                        },
                    }}
                    render={() => (
                        <ImageInput {...defautProps} source="image">
                            <ImageField source="url" title="title" />
                        </ImageInput>
                    )}
                />
            );

            const updatedPreviewImage = queryByTitle('Hello world!');
            expect(updatedPreviewImage).not.toBeNull();
            expect(updatedPreviewImage.getAttribute('src')).toEqual(
                'http://static.acme.com/bar.jpg'
            );
        });

        // Skipped until https://github.com/jsdom/jsdom/issues/1568 is fixed
        it.skip('should update previews when dropping a file', async () => {
            const onSubmit = jest.fn();

            const { getByTestId, queryByRole } = render(
                <Form
                    initialValues={{
                        images: [],
                    }}
                    onSubmit={onSubmit}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <ImageInput {...defautPropsMultiple}>
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
