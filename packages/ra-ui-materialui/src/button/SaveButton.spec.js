import { render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';

import { SaveButton } from './SaveButton';

const translate = label => label;

describe('<SaveButton />', () => {
    afterEach(cleanup);

    it('should render as submit type when submitOnEnter is true', () => {
        const { getByLabelText } = render(
            <SaveButton submitOnEnter translate={translate} />
        );
        expect(getByLabelText('ra.action.save').getAttribute('type')).toEqual(
            'submit'
        );
    });

    it('should render as button type when submitOnEnter is false', () => {
        const { getByLabelText } = render(
            <SaveButton submitOnEnter={false} translate={translate} />
        );

        expect(getByLabelText('ra.action.save').getAttribute('type')).toEqual(
            'button'
        );
    });

    it('should trigger submit action when clicked if no saving is in progress', () => {
        const onSubmit = jest.fn();
        const { getByLabelText } = render(
            <SaveButton
                translate={translate}
                handleSubmitWithRedirect={onSubmit}
                saving={false}
            />
        );

        fireEvent.mouseDown(getByLabelText('ra.action.save'));
        expect(onSubmit).toHaveBeenCalled();
    });

    it('should not trigger submit action when clicked if saving is in progress', () => {
        const onSubmit = jest.fn();

        const { getByLabelText } = render(
            <SaveButton
                translate={translate}
                handleSubmitWithRedirect={onSubmit}
                saving
            />
        );

        fireEvent.mouseDown(getByLabelText('ra.action.save'));
        expect(onSubmit).not.toHaveBeenCalled();
    });
    it('should show a notification if the form is not valid', () => {
        const onSubmit = jest.fn();
        const showNotification = jest.fn();

        const { getByLabelText } = render(
            <SaveButton
                translate={translate}
                handleSubmitWithRedirect={onSubmit}
                invalid
                showNotification={showNotification}
            />
        );

        fireEvent.mouseDown(getByLabelText('ra.action.save'));
        expect(showNotification).toHaveBeenCalled();
        expect(onSubmit).toHaveBeenCalled();
    });
});
