import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import { FileInputPreview } from './FileInputPreview';

describe('<FileInputPreview />', () => {
    it('should call `onRemove` prop when clicking on remove button', () => {
        const onRemoveSpy = sinon.spy();

        const wrapper = shallow(
            <FileInputPreview onRemove={onRemoveSpy}>
                <div>Child</div>
            </FileInputPreview>
        );

        const removeButton = wrapper.find('IconButton');
        removeButton.simulate('click');

        assert.equal(onRemoveSpy.args.length, 1);
    });

    it('should render passed children', () => {
        const wrapper = shallow(
            <FileInputPreview>
                <div id="child">Child</div>
            </FileInputPreview>
        );

        const child = wrapper.find('#child');
        assert.equal(child.length, 1);
    });

    it('should clean up generated URLs for preview', () => {
        const file = { preview: 'previewUrl' };
        const revokeObjectURL = sinon.spy();

        global.window = {
            URL: {
                revokeObjectURL,
            },
        };
        const wrapper = shallow(
            <FileInputPreview file={file}>
                <div id="child">Child</div>
            </FileInputPreview>,
            { lifecycleExperimental: true }
        );

        wrapper.unmount();
        assert(revokeObjectURL.calledWith('previewUrl'));
    });

    it('should not try to clean up preview urls if not passed a File object with a preview', () => {
        const file = {};
        const revokeObjectURL = sinon.spy();

        global.window = {
            URL: {
                revokeObjectURL,
            },
        };
        const wrapper = shallow(
            <FileInputPreview file={file}>
                <div id="child">Child</div>
            </FileInputPreview>,
            { lifecycleExperimental: true }
        );

        wrapper.unmount();
        assert(revokeObjectURL.notCalled);
    });
});
