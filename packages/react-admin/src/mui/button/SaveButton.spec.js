import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { SaveButton } from './SaveButton';

const translate = label => label;

describe('<SaveButton />', () => {
    it('should render <Button raised={true}/> when raised is true', () => {
        const wrapper = shallow(
            <SaveButton raised={true} translate={translate} />
        );
        const ButtonElement = wrapper.find('withStyles(Button)');
        assert.equal(ButtonElement.length, 1);
        assert.equal(ButtonElement.at(0).prop('raised'), true);
    });

    it('should render <Button raised={false}/> when raised is false', () => {
        const wrapper = shallow(
            <SaveButton raised={false} translate={translate} />
        );
        const ButtonElement = wrapper.find('withStyles(Button)');
        assert.equal(ButtonElement.length, 1);
        assert.equal(ButtonElement.at(0).prop('raised'), false);
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
        const onSubmit = jest.fn();
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
        assert.equal(onSubmit.mock.calls.length, 1);
        flatButtonWrapper.simulate('click');
        assert.equal(onSubmit.mock.calls.length, 2);
    });

    it('should not trigger submit action when clicked if saving is in progress', () => {
        const onSubmit = jest.fn();
        const event = { preventDefault: jest.fn() };

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
        assert.equal(event.preventDefault.mock.calls.length, 1);
        flatButtonWrapper.simulate('click', event);
        assert.equal(event.preventDefault.mock.calls.length, 2);

        assert.equal(onSubmit.mock.calls.length, 0);
    });
});
