import * as React from 'react';
import { Alert, AlertProps, Button, ButtonProps } from '@mui/material';
import { useTranslate } from 'ra-core';

export const ApplicationUpdatedNotification = React.forwardRef<
    HTMLDivElement,
    ApplicationUpdatedNotificationProps
>((props, ref) => {
    const {
        ButtonProps,
        updateText = 'ra.action.update_application',
        notificationText = 'ra.notification.application_update_available',
        ...alertProps
    } = props;
    const translate = useTranslate();

    const handleButtonClick = () => {
        window.location.reload();
    };
    return (
        <Alert
            ref={ref}
            severity="info"
            action={
                <Button
                    color="inherit"
                    size="small"
                    onClick={handleButtonClick}
                    {...ButtonProps}
                >
                    {translate(updateText, { _: updateText })}
                </Button>
            }
            {...alertProps}
        >
            {translate(notificationText, { _: notificationText })}
        </Alert>
    );
});

export interface ApplicationUpdatedNotificationProps extends AlertProps {
    ButtonProps?: ButtonProps;
    notificationText?: string;
    updateText?: string;
}
