import { render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import expect from 'expect';
import { TestContext } from 'ra-core';

import SaveButton from './SaveButton';

describe('<SaveButton />', () => {
    afterEach(cleanup);

    it('should render as submit type when submitOnEnter is true', () => {
        const { getByLabelText } = render(
            <TestContext>
                <SaveButton submitOnEnter />
            </TestContext>
        );
        expect(getByLabelText('ra.action.save').getAttribute('type')).toEqual(
            'submit'
        );
    });

    it('should render as button type when submitOnEnter is false', () => {
        const { getByLabelText } = render(
            <TestContext>
                <SaveButton submitOnEnter={false} />
            </TestContext>
        );

        expect(getByLabelText('ra.action.save').getAttribute('type')).toEqual(
            'button'
        );
    });

    it('should trigger submit action when clicked if no saving is in progress', () => {
        const onSubmit = jest.fn();
        const { getByLabelText } = render(
            <TestContext>
                <SaveButton
                    handleSubmitWithRedirect={onSubmit}
                    saving={false}
                />
            </TestContext>
        );

        fireEvent.mouseDown(getByLabelText('ra.action.save'));
        expect(onSubmit).toHaveBeenCalled();
    });

    it('should not trigger submit action when clicked if saving is in progress', () => {
        const onSubmit = jest.fn();

        const { getByLabelText } = render(
            <TestContext>
                <SaveButton handleSubmitWithRedirect={onSubmit} saving />
            </TestContext>
        );

        fireEvent.mouseDown(getByLabelText('ra.action.save'));
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should show a notification if the form is not valid', () => {
        const onSubmit = jest.fn();
        let dispatchSpy;

        const { getByLabelText } = render(
            <TestContext>
                {({ store }) => {
                    dispatchSpy = jest.spyOn(store, 'dispatch');
                    return (
                        <SaveButton
                            handleSubmitWithRedirect={onSubmit}
                            invalid
                        />
                    );
                }}
            </TestContext>
        );

        fireEvent.mouseDown(getByLabelText('ra.action.save'));
        expect(dispatchSpy).toHaveBeenCalledWith({
            payload: {
                message: 'ra.message.invalid_form',
                messageArgs: {},
                type: 'warning',
                undoable: false,
            },
            type: 'RA/SHOW_NOTIFICATION',
        });
        expect(onSubmit).toHaveBeenCalled();
    });
});
