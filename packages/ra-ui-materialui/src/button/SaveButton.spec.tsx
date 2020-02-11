import { render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import expect from 'expect';
import { TestContext } from 'ra-core';

import Create from '../detail/Create';
import SimpleForm from '../form/SimpleForm';
import Toolbar from '../form/Toolbar';
import TextInput from '../input/TextInput';
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
        fireEvent.click(getByLabelText('ra.action.save'));
        expect(onSubmit).toHaveBeenCalled();
    });

    it('should trigger submit action when Enter key if no saving is in progress', () => {
        const onSubmit = jest.fn();

        const defaultCreateProps = {
            basePath: '/foo',
            id: '123',
            resource: 'foo',
            location: {},
            match: {},
        };

        const SaveToolbar = props => (
            <Toolbar {...props}>
                <SaveButton
                    label="enterButton"
                    handleSubmitWithRedirect={onSubmit}
                    submitOnEnter={true}
                    saving={false}
                />
            </Toolbar>
        );

        const { getByLabelText } = render(
            <TestContext>
                <Create {...defaultCreateProps}>
                    <SimpleForm toolbar={<SaveToolbar />}>
                        <TextInput label="Title" source="title" />
                    </SimpleForm>
                </Create>
            </TestContext>
        );

        const input = getByLabelText('Title');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'test' } });

        const button = getByLabelText('enterButton');
        //console.log(button);
        //fireEvent.click(getByLabelText('ra.action.save'));
        fireEvent.keyPress(input, { key: 'Enter', keyCode: 13 });
        expect(onSubmit).toHaveBeenCalled();
    });

    it('should not trigger submit action when clicked if saving is in progress', () => {
        const onSubmit = jest.fn();

        const { getByLabelText } = render(
            <TestContext>
                <SaveButton handleSubmitWithRedirect={onSubmit} saving />
            </TestContext>
        );

        fireEvent.click(getByLabelText('ra.action.save'));
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

        fireEvent.click(getByLabelText('ra.action.save'));
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
