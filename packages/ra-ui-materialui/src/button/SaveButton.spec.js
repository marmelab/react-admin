import { shallow } from 'enzyme';
import React from 'react';

import { SaveButton } from './SaveButton';

const translate = label => label;

describe('<SaveButton />', () => {
    it('should render <Button raised={true}/> when raised is true', () => {
        const wrapper = shallow(
            <SaveButton raised={true} translate={translate} />
        );
        const ButtonElement = wrapper.find('WithStyles(Button)');
        expect(ButtonElement.length).toEqual(1);
        expect(ButtonElement.at(0).prop('raised')).toEqual(true);
    });

    it('should render <Button raised={false}/> when raised is false', () => {
        const wrapper = shallow(
            <SaveButton raised={false} translate={translate} />
        );
        const ButtonElement = wrapper.find('WithStyles(Button)');
        expect(ButtonElement.length).toEqual(1);
        expect(ButtonElement.at(0).prop('raised')).toEqual(false);
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

        expect(raisedButtonWrapper.prop('type')).toEqual('submit');
        expect(flatButtonWrapper.prop('type')).toEqual('submit');
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

        expect(raisedButtonWrapper.prop('type')).toEqual('button');
        expect(flatButtonWrapper.prop('type')).toEqual('button');
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
        expect(onSubmit.mock.calls.length).toEqual(1);
        flatButtonWrapper.simulate('click');
        expect(onSubmit.mock.calls.length).toEqual(2);
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
        expect(event.preventDefault.mock.calls.length).toEqual(1);
        flatButtonWrapper.simulate('click', event);
        expect(event.preventDefault.mock.calls.length).toEqual(2);

        expect(onSubmit.mock.calls.length).toEqual(0);
    });
    it('should show a notification if the form is not valid', () => {
        const onSubmit = jest.fn();
        const showNotification = jest.fn();
        const event = { preventDefault: jest.fn() };

        const raisedButtonWrapper = shallow(
            <SaveButton
                raised={true}
                translate={translate}
                handleSubmitWithRedirect={() => onSubmit}
                invalid={true}
                showNotification={showNotification}
            />
        );
        const flatButtonWrapper = shallow(
            <SaveButton
                raised={false}
                translate={translate}
                handleSubmitWithRedirect={() => onSubmit}
                invalid={true}
                showNotification={showNotification}
            />
        );

        raisedButtonWrapper.simulate('click', event);
        expect(showNotification.mock.calls.length).toEqual(1);
        flatButtonWrapper.simulate('click', event);
        expect(showNotification.mock.calls.length).toEqual(2);

        expect(onSubmit.mock.calls.length).toEqual(2);
    });
});
