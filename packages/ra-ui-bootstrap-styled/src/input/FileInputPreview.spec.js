import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { FileInputPreview } from './FileInputPreview';

describe('<FileInputPreview />', () => {
    it('should call `onRemove` prop when clicking on remove button', () => {
        const onRemoveSpy = jest.fn();

        const wrapper = shallow(
            <FileInputPreview onRemove={onRemoveSpy}>
                <div>Child</div>
            </FileInputPreview>
        );

        const removeButton = wrapper.find('WithStyles(IconButton)');
        removeButton.simulate('click');

        assert.equal(onRemoveSpy.mock.calls.length, 1);
    });

    it('should render passed children', () => {
        const wrapper = shallow(
            <FileInputPreview onRemove={() => true}>
                <div id="child">Child</div>
            </FileInputPreview>
        );

        const child = wrapper.find('#child');
        assert.equal(child.length, 1);
    });

    it('should clean up generated URLs for preview', () => {
        const file = { preview: 'previewUrl' };
        const revokeObjectURL = jest.fn();

        const wrapper = shallow(
            <FileInputPreview
                onRemove={() => true}
                file={file}
                revokeObjectURL={revokeObjectURL}
            >
                <div id="child">Child</div>
            </FileInputPreview>
        );

        wrapper.unmount();
        assert.equal(revokeObjectURL.mock.calls[0][0], 'previewUrl');
    });

    it('should not try to clean up preview urls if not passed a File object with a preview', () => {
        const file = {};
        const revokeObjectURL = jest.fn();

        const wrapper = shallow(
            <FileInputPreview
                onRemove={() => true}
                file={file}
                revokeObjectURL={revokeObjectURL}
            >
                <div id="child">Child</div>
            </FileInputPreview>
        );

        wrapper.unmount();
        assert.equal(revokeObjectURL.mock.calls.length, 0);
    });
});
