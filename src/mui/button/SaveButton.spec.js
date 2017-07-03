import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import { SaveButton } from './SaveButton';

const translate = label => label;

describe('<SaveButton />', () => {
    it('should render <RaisedButton /> when raised is true', () => {
        const wrapper = shallow(
            <SaveButton raised={true} translate={translate} />
        );

        assert.equal(wrapper.type().muiName, 'RaisedButton');
    });

    it('should render <FlatButton /> when raised is false', () => {
        const wrapper = shallow(
            <SaveButton raised={false} translate={translate} />
        );

        assert.equal(wrapper.type().muiName, 'FlatButton');
    });

    it('should render as submit type when submitOnEnter is true', () => {
        const raisedButtonWrapper = shallow(
            <SaveButton
                raised={true}
                submitOnEnter={true}
                translate={translate}
            />
        );
        const flatButtonWrapper = shallow(
            <SaveButton
                raised={false}
                submitOnEnter={true}
                translate={translate}
            />
        );

        assert.equal(raisedButtonWrapper.prop('type'), 'submit');
        assert.equal(flatButtonWrapper.prop('type'), 'submit');
    });

    it('should render as button type when submitOnEnter is false', () => {
        const raisedButtonWrapper = shallow(
            <SaveButton
                raised={true}
                submitOnEnter={false}
                translate={translate}
            />
        );
        const flatButtonWrapper = shallow(
            <SaveButton
                raised={false}
                submitOnEnter={false}
                translate={translate}
            />
        );

        assert.equal(raisedButtonWrapper.prop('type'), 'button');
        assert.equal(flatButtonWrapper.prop('type'), 'button');
    });

    it('should trigger submit action when clicked if no saving is in progress', () => {
        const onSubmit = sinon.spy();
        const raisedButtonWrapper = shallow(
            <SaveButton
                raised={true}
                translate={translate}
                handleSubmitWithRedirect={() => onSubmit}
                saving={false}
            />
        );
        const flatButtonWrapper = shallow(
            <SaveButton
                raised={false}
                translate={translate}
                handleSubmitWithRedirect={() => onSubmit}
                saving={false}
            />
        );

        raisedButtonWrapper.simulate('click');
        assert(onSubmit.calledOnce);
        flatButtonWrapper.simulate('click');
        assert(onSubmit.calledTwice);
    });

    it('should not trigger submit action when clicked if saving is in progress', () => {
        const onSubmit = sinon.spy();
        const event = { preventDefault: sinon.spy() };

        const raisedButtonWrapper = shallow(
            <SaveButton
                raised={true}
                translate={translate}
                handleSubmitWithRedirect={() => onSubmit}
                saving={true}
            />
        );
        const flatButtonWrapper = shallow(
            <SaveButton
                raised={false}
                translate={translate}
                handleSubmitWithRedirect={() => onSubmit}
                saving={true}
            />
        );

        raisedButtonWrapper.simulate('click', event);
        assert(event.preventDefault.calledOnce);
        flatButtonWrapper.simulate('click', event);
        assert(event.preventDefault.calledTwice);

        assert(onSubmit.notCalled);
    });
});
