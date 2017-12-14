import { shallow } from 'enzyme';
import React from 'react';

import { SaveButton } from './SaveButton';

const translate = label => label;

describe('<SaveButton />', () => {
    test('should render <Button raised={true}/> when raised is true', () => {
        const wrapper = shallow(
            <SaveButton raised={true} translate={translate} />
        );
        const ButtonElement = wrapper.find('withStyles(Button)');
        expect(ButtonElement.length).toEqual(1);
        expect(ButtonElement.at(0).prop('raised')).toEqual(true);
    });

    test('should render <Button raised={false}/> when raised is false', () => {
        const wrapper = shallow(
            <SaveButton raised={false} translate={translate} />
        );
        const ButtonElement = wrapper.find('withStyles(Button)');
        expect(ButtonElement.length).toEqual(1);
        expect(ButtonElement.at(0).prop('raised')).toEqual(false);
    });

    test('should render as submit type when submitOnEnter is true', () => {
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

    test('should render as button type when submitOnEnter is false', () => {
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

    test('should trigger submit action when clicked if no saving is in progress', () => {
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

    test('should not trigger submit action when clicked if saving is in progress', () => {
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
});
