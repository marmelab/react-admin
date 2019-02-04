import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { File, FileReader } from 'file-api';

import { ImageField } from '../field/ImageField';
import { FileInput } from './FileInput';

describe('<FileInput />', () => {
    beforeAll(() => {
        global.File = File;
        global.FileReader = FileReader;
    });

    afterAll(() => {
        delete global.File;
        delete global.FileReader;
    });

    it('should display a dropzone', () => {
        const wrapper = shallow(
            <FileInput
                input={{
                    value: {
                        picture: null,
                    },
                }}
                translate={x => x}
                source="picture"
            />
        );

        assert.equal(wrapper.find('Dropzone').length, 1);
    });

    it('should correctly update upon drop when allowing a single file', () => {
        const onBlur = jest.fn();

        const wrapper = shallow(
            <FileInput
                input={{
                    value: {
                        src: 'b64_picture',
                    },
                    onBlur,
                }}
                translate={x => x}
                source="src"
            />
        );

        wrapper.instance().onDrop([{ preview: 'new_b64_picture' }]);

        assert.deepEqual(onBlur.mock.calls[0][0], {
            preview: 'new_b64_picture',
        });
    });

    it('should correctly update upon removal when allowing a single file', () => {
        const onBlur = jest.fn();

        const wrapper = shallow(
            <FileInput
                input={{
                    value: {
                        src: 'b64_picture',
                    },
                    onBlur,
                }}
                translate={x => x}
                source="src"
            />
        );

        wrapper.instance().onRemove({ src: 'b64_picture' })();
        assert.deepEqual(onBlur.mock.calls[0][0], null);
    });

    it('should correctly update upon drop when allowing multiple files', () => {
        const onBlur = jest.fn();

        const wrapper = shallow(
            <FileInput
                input={{
                    value: [
                        { src: 'b64_picture' },
                        { src: 'another_b64_picture' },
                    ],
                    onBlur,
                }}
                translate={x => x}
                source="pictures"
                multiple
            />
        );

        wrapper.instance().onDrop([{ preview: 'new_b64_picture' }]);

        assert.deepEqual(onBlur.mock.calls[0][0], [
            { src: 'b64_picture' },
            { src: 'another_b64_picture' },
            { preview: 'new_b64_picture' },
        ]);
    });

    it('should correctly update upon removal when allowing multiple files', () => {
        const onBlur = jest.fn();

        const wrapper = shallow(
            <FileInput
                input={{
                    value: [
                        { src: 'b64_picture' },
                        { src: 'another_b64_picture' },
                    ],
                    onBlur,
                }}
                translate={x => x}
                source="pictures"
                multiple
            />
        );

        wrapper.instance().onRemove({ src: 'another_b64_picture' })();

        assert.deepEqual(onBlur.mock.calls[0][0], [{ src: 'b64_picture' }]);
    });

    it('should display correct label depending multiple property', () => {
        const test = (multiple, expectedLabel) => {
            const wrapper = shallow(
                <FileInput
                    multiple={multiple}
                    input={{
                        value: {
                            picture: null,
                        },
                    }}
                    translate={x => x}
                    source="picture"
                />
            );

            assert.equal(wrapper.find('Dropzone p').text(), expectedLabel);
        };

        test(false, 'ra.input.file.upload_single');
        test(true, 'ra.input.file.upload_several');
    });

    it('should display correct custom label', () => {
        const test = expectedLabel => {
            const wrapper = shallow(
                <FileInput
                    placeholder={expectedLabel}
                    input={{
                        value: {
                            picture: null,
                        },
                    }}
                    translate={x => x}
                    source="picture"
                />
            );

            assert.ok(wrapper.find('Dropzone').contains(expectedLabel));
        };
        const CustomLabel = () => <div>Custom label</div>;

        test('custom label');
        test(<h1>Custom label</h1>);
        test(<CustomLabel />);
    });

    describe('Image Preview', () => {
        it('should display file preview using child as preview component', () => {
            const wrapper = shallow(
                <FileInput
                    input={{
                        value: {
                            url: 'http://foo.com/bar.jpg',
                            title: 'Hello world!',
                        },
                    }}
                    translate={x => x}
                >
                    <ImageField source="url" title="title" />
                </FileInput>
            );

            const previewImage = wrapper.find('ImageField');

            assert.equal(previewImage.length, 1);
            assert.equal(previewImage.prop('source'), 'url');
            assert.equal(previewImage.prop('title'), 'title');
            assert.deepEqual(previewImage.prop('record'), {
                title: 'Hello world!',
                url: 'http://foo.com/bar.jpg',
            });
        });

        it('should display all files (when several) previews using child as preview component', () => {
            const wrapper = shallow(
                <FileInput
                    input={{
                        value: [
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
                    translate={x => x}
                >
                    <ImageField source="url" title="title" />
                </FileInput>
            );

            const previewImages = wrapper.find('ImageField');

            assert.equal(previewImages.length, 2);
            assert.equal(previewImages.at(0).prop('source'), 'url');
            assert.equal(previewImages.at(0).prop('title'), 'title');
            assert.deepEqual(
                previewImages.at(0).prop('record').title,
                'Hello world!'
            );
            assert.deepEqual(
                previewImages.at(0).prop('record').url,
                'http://foo.com/bar.jpg'
            );

            assert.equal(previewImages.at(1).prop('source'), 'url');
            assert.equal(previewImages.at(1).prop('title'), 'title');
            assert.deepEqual(
                previewImages.at(1).prop('record').title,
                'A good old Bitmap!'
            );
            assert.deepEqual(
                previewImages.at(1).prop('record').url,
                'http://foo.com/qux.bmp'
            );
        });

        it('should update previews when updating input value', () => {
            const wrapper = shallow(
                <FileInput
                    source="picture"
                    translate={x => x}
                    input={{
                        value: {
                            url: 'http://static.acme.com/foo.jpg',
                        },
                    }}
                >
                    <ImageField source="url" />
                </FileInput>
            );

            const previewImage = wrapper.find('ImageField');
            const previewUrl = previewImage.prop('record').url;
            assert.equal(previewUrl, 'http://static.acme.com/foo.jpg');

            wrapper.setProps({
                input: {
                    value: {
                        url: 'http://static.acme.com/bar.jpg',
                    },
                },
            });

            wrapper.update();

            const updatedPreviewImage = wrapper.find('ImageField');
            const updatedPreviewUrl = updatedPreviewImage.prop('record').url;
            assert.equal(updatedPreviewUrl, 'http://static.acme.com/bar.jpg');
        });

        it('should update previews when dropping a file', () => {
            const wrapper = shallow(
                <FileInput source="picture" translate={x => x} input={{}}>
                    <ImageField source="url" />
                </FileInput>
            );

            wrapper.setProps({
                input: {
                    value: {
                        url: 'blob:http://localhost:8080/1234-5678',
                    },
                },
            });

            wrapper.update();

            const imagePreview = wrapper.find('ImageField');
            const previewUrl = imagePreview.prop('record').url;
            assert.equal(previewUrl, 'blob:http://localhost:8080/1234-5678');
        });
    });

    it('should allow to remove an image from the input with `FileInputPreview.onRemove`', () => {
        const wrapper = shallow(
            <FileInput
                source="picture"
                translate={x => x}
                input={{
                    onBlur: () => {},
                    value: [
                        { url: 'http://static.acme.com/foo.jpg' },
                        { url: 'http://static.acme.com/bar.jpg' },
                        { url: 'http://static.acme.com/quz.jpg' },
                    ],
                }}
            >
                <ImageField source="url" />
            </FileInput>
        );

        const inputPreview = wrapper.find(
            'WithStyles(translate(FileInputPreview))'
        );
        inputPreview.at(1).prop('onRemove')();
        wrapper.update();

        const previewImages = wrapper
            .find('ImageField')
            .map(f => f.prop('record'));
        assert.deepEqual(previewImages, [
            { url: 'http://static.acme.com/foo.jpg' },
            { url: 'http://static.acme.com/quz.jpg' },
        ]);
    });
});
