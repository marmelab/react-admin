import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import ImageField from '../field/ImageField';
import { ImageInput } from './ImageInput';

describe('<ImageInput />', () => {
    it('should display a dropzone', () => {
        const wrapper = shallow((
            <ImageInput
                input={{
                    value: {
                        picture: null,
                    },
                }}
                source="picture"
            />
        ));

        assert.equal(wrapper.find('Dropzone').length, 1);
    });

    it('should display correct label depending multiple property', () => {
        const test = (multiple, expectedLabel) => {
            const wrapper = shallow((
                <ImageInput
                    multiple={multiple}
                    input={{
                        value: {
                            picture: null,
                        },
                    }}
                    source="picture"
                />
            ));

            assert.equal(wrapper.find('Dropzone p').text(), expectedLabel);
        };

        test(false, 'aor.input.image.upload_single');
        test(true, 'aor.input.image.upload_several');
    });

    it('should display file preview using child as preview component', () => {
        const wrapper = shallow((
            <ImageInput
                input={{
                    value: {
                        url: 'http://foo.com/bar.jpg',
                        title: 'Hello world!',
                    },
                }}
            >
                <ImageField source="url" title="title" />
            </ImageInput>
        ));

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
        const wrapper = shallow((
            <ImageInput
                input={{
                    value: [
                        { url: 'http://foo.com/bar.jpg', title: 'Hello world!' },
                        { url: 'http://foo.com/qux.bmp', title: 'A good old Bitmap!' },
                    ],
                }}
            >
                <ImageField source="url" title="title" />
            </ImageInput>
        ));

        const previewImages = wrapper.find('ImageField');

        assert.equal(previewImages.length, 2);
        assert.equal(previewImages.at(0).prop('source'), 'url');
        assert.equal(previewImages.at(0).prop('title'), 'title');
        assert.deepEqual(previewImages.at(0).prop('record').title, 'Hello world!');
        assert.deepEqual(previewImages.at(0).prop('record').url, 'http://foo.com/bar.jpg');

        assert.equal(previewImages.at(1).prop('source'), 'url');
        assert.equal(previewImages.at(1).prop('title'), 'title');
        assert.deepEqual(previewImages.at(1).prop('record').title, 'A good old Bitmap!');
        assert.deepEqual(previewImages.at(1).prop('record').url, 'http://foo.com/qux.bmp');
    });
});
