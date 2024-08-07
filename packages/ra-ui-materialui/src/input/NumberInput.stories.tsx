import * as React from 'react';
import { required } from 'ra-core';
import { useFormState, useFormContext } from 'react-hook-form';

import { NumberInput } from './NumberInput';
import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { FormInspector } from './common';
import { TextInput } from './TextInput';

export default { title: 'ra-ui-materialui/input/NumberInput' };

const Wrapper = ({ children }) => (
    <AdminContext defaultTheme="light">
        <Create
            resource="posts"
            record={{ id: 123, views: 23 }}
            sx={{ width: 600 }}
        >
            <SimpleForm>{children}</SimpleForm>
        </Create>
    </AdminContext>
);

export const Basic = () => (
    <Wrapper>
        <NumberInput source="views" />
        <FormInspector name="views" />
    </Wrapper>
);

export const ReadOnly = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, views: 23 }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <NumberInput source="views" readOnly />
                <NumberInput source="price" readOnly />
                <FormInspector name="views" />
                <FormInspector name="price" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Disabled = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, views: 23 }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <NumberInput source="views" disabled />
                <NumberInput source="price" disabled />
                <FormInspector name="views" />
                <FormInspector name="price" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Float = () => (
    <AdminContext defaultTheme="light">
        <Create
            resource="poi"
            record={{ id: 123, lat: 48.692054, long: 6.184417 }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <NumberInput source="lat" />
                <NumberInput source="long" />
                <FormInspector name="lat" />
                <FormInspector name="long" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const DefaultValue = () => (
    <Wrapper>
        <NumberInput source="views" defaultValue={26} />
        <NumberInput source="views1" label="Default 6" defaultValue={6} />
        <NumberInput source="views2" label="Default 0" defaultValue={0} />
        <NumberInput source="views3" label="Default undefined" />
        <FormInspector name="views" />
        <FormInspector name="views1" />
        <FormInspector name="views2" />
        <FormInspector name="views3" />
    </Wrapper>
);

export const HelperText = () => (
    <Wrapper>
        <NumberInput source="views" />
        <NumberInput source="views" helperText={false} />
        <NumberInput
            source="views"
            helperText="Number of times the post was read"
        />
    </Wrapper>
);

export const Label = () => (
    <Wrapper>
        <NumberInput source="views" />
        <NumberInput source="views" label={false} />
        <NumberInput source="views" label="Number of views" />
    </Wrapper>
);

export const NonFullWidth = () => (
    <Wrapper>
        <NumberInput source="views" label="default" />
        <NumberInput
            source="views"
            label="Full Width False"
            fullWidth={false}
        />
    </Wrapper>
);

export const Margin = () => (
    <Wrapper>
        <NumberInput source="views" label="default (dense)" />
        <NumberInput source="views" label="none" margin="none" />
        <NumberInput source="views" label="normal" margin="normal" />
    </Wrapper>
);

export const Variant = () => (
    <Wrapper>
        <NumberInput source="views" label="default (filled)" />
        <NumberInput source="views" label="outlined" variant="outlined" />
        <NumberInput source="views" label="standard" variant="standard" />
    </Wrapper>
);

export const Step = () => (
    <Wrapper>
        <NumberInput source="views" label="No step" />
        <NumberInput source="views" label="Step 0.1" step={0.1} />
        <NumberInput source="views" label="Step 10" step={10} />
    </Wrapper>
);

export const MinMax = () => (
    <Wrapper>
        <NumberInput source="views" label="No min or max" />
        <NumberInput source="views" label="Min 20, max 30" min={20} max={30} />
        <NumberInput source="views" label="Min 50" min={50} />
    </Wrapper>
);

export const Required = () => (
    <Wrapper>
        <NumberInput source="views" />
        <NumberInput source="views" required />
        <NumberInput source="views" validate={required()} />
        <NumberInput source="views" validate={[required()]} />
    </Wrapper>
);

export const Error = () => (
    <AdminContext defaultTheme="light">
        <Create
            resource="posts"
            record={{ id: 123, views: 23 }}
            sx={{ width: 600 }}
        >
            <SimpleForm
                resolver={() => ({
                    values: {},
                    errors: {
                        views: {
                            type: 'custom',
                            message: 'Special error message',
                        },
                    },
                })}
            >
                <NumberInput source="views" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Sx = () => (
    <Wrapper>
        <NumberInput
            source="views"
            sx={{
                border: 'solid 1px red',
                borderRadius: '5px',
                '& .MuiInputLabel-root': { fontWeight: 'bold' },
            }}
        />
    </Wrapper>
);

const FormStateInspector = () => {
    const { touchedFields, isDirty, dirtyFields, isValid, errors } =
        useFormState();
    return (
        <div>
            form state:&nbsp;
            <code style={{ backgroundColor: 'lightgrey' }}>
                {JSON.stringify({
                    touchedFields,
                    isDirty,
                    dirtyFields,
                    isValid,
                    errors,
                })}
            </code>
        </div>
    );
};

const FieldStateInspector = ({ name = 'views' }) => {
    const formContext = useFormContext();
    const { dirtyFields } = formContext.formState;
    const isDirty = Object.keys(dirtyFields).includes(name);
    const { isTouched, isValidating, invalid, error } =
        formContext.getFieldState(name, formContext.formState);
    return (
        <div>
            {name}:
            <code style={{ backgroundColor: 'lightgrey' }}>
                {JSON.stringify({
                    isDirty,
                    isTouched,
                    isValidating,
                    invalid,
                    error,
                })}
            </code>
        </div>
    );
};

export const FieldState = () => (
    <Wrapper>
        <NumberInput source="views" />
        <FormStateInspector />
        <FieldStateInspector />
    </Wrapper>
);

export const ShouldUnregister = () => (
    <Wrapper>
        <NumberInput source="views" shouldUnregister />
    </Wrapper>
);

const SetFocusButton = ({ source }) => {
    const { setFocus } = useFormContext();
    return (
        <button onClick={() => setFocus(source)}>Set focus on {source}</button>
    );
};

export const SetFocus = () => (
    <Wrapper>
        <TextInput source="title" />
        <NumberInput source="views" />
        <SetFocusButton source="views" />
    </Wrapper>
);
