import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import { ImageInputPreview } from './ImageInputPreview';

describe('<ImageInputPreview />', () => {
    it('should call `onRemove` prop when clicking on remove button', () => {
        const onRemoveSpy = sinon.spy();

        const wrapper = shallow((
            <ImageInputPreview onRemove={onRemoveSpy}>
                <div>Child</div>
            </ImageInputPreview>
        ));

        const removeButton = wrapper.find('FlatButton');
        removeButton.simulate('click');

        assert.equal(onRemoveSpy.args.length, 1);
    });

    it('should render passed children', () => {
        const wrapper = shallow((
            <ImageInputPreview>
                <div id="child">Child</div>
            </ImageInputPreview>
        ));

        const child = wrapper.find('#child');
        assert.equal(child.length, 1);
    });
});
