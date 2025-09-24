import * as React from 'react';
import { Form, FormProps, Translate } from '../';
import { useFormContext } from 'react-hook-form';

export const SimpleForm = ({ children, ...props }: FormProps) => (
    <Form {...props}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
            {React.Children.map(children, child => (
                <div>{child}</div>
            ))}
        </div>
        <div>
            <SaveButton />
        </div>
    </Form>
);

const SaveButton = () => {
    const { formState } = useFormContext();
    const { isSubmitting } = formState;
    return (
        <button type="submit" disabled={isSubmitting}>
            <Translate i18nKey="ra.action.save">Save</Translate>
        </button>
    );
};
