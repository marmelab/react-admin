import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { useRecordContext } from 'ra-core';
import { useFormContext, useWatch } from 'react-hook-form';
import { Box, Button, createTheme, Typography } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';
import get from 'lodash/get.js';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm, SimpleFormProps } from '../form';
import { DateTimeInput, DateTimeInputProps } from './DateTimeInput';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/DateTimeInput' };

export const Basic = () => (
    <Wrapper>
        <DateTimeInput source="published" />
    </Wrapper>
);

export const NonFullWidth = () => (
    <Wrapper>
        <DateTimeInput source="published" fullWidth={false} />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <DateTimeInput source="published" disabled />
        <DateTimeInput
            source="announcement"
            disabled
            defaultValue="01/01/2000-12:12"
        />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <DateTimeInput source="published" readOnly />
        <DateTimeInput
            source="announcement"
            readOnly
            defaultValue="01/01/2000-12:12"
        />
    </Wrapper>
);

export const OutlinedNoLabel = () => (
    <Wrapper>
        <DateTimeInput source="published" label={false} variant="outlined" />
    </Wrapper>
);

export const ExternalChanges = ({
    simpleFormProps = {
        defaultValues: { published: '2021-09-11 20:00:00' },
    },
}: {
    simpleFormProps?: Omit<SimpleFormProps, 'children'>;
}) => (
    <Wrapper simpleFormProps={simpleFormProps}>
        <DateTimeInput source="published" />
        <DateHelper source="published" value="2021-10-20 10:00:00" />
    </Wrapper>
);

export const ExternalChangesWithParse = ({
    dateTimeInputProps = {
        parse: (value: string) => new Date(value),
    },
    simpleFormProps = {
        defaultValues: { published: new Date('2021-09-11 20:00:00') },
    },
}: {
    dateTimeInputProps?: Partial<DateTimeInputProps>;
    simpleFormProps?: Omit<SimpleFormProps, 'children'>;
}) => (
    <Wrapper simpleFormProps={simpleFormProps}>
        <DateTimeInput source="published" {...dateTimeInputProps} />
        <DateHelper
            source="published"
            value={new Date('2021-10-20 10:00:00')}
        />
    </Wrapper>
);

const parseDateTime = (value: string) =>
    value ? new Date(value) : value === '' ? null : value;

export const AsDateObject = () => (
    <Wrapper>
        <DateTimeInput source="published" parse={parseDateTime} />
    </Wrapper>
);

export const Themed = () => (
    <Wrapper
        theme={createTheme({
            components: {
                RaDateTimeInput: {
                    defaultProps: {
                        'data-testid': 'themed',
                    } as any,
                    styleOverrides: {
                        root: {
                            ['& input']: {
                                color: 'red',
                            },
                        },
                    },
                },
            },
        })}
    >
        <DateTimeInput source="published" />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({
    children,
    simpleFormProps,
    theme,
}: {
    children: React.ReactNode;
    simpleFormProps?: Omit<SimpleFormProps, 'children'>;
    theme: ThemeOptions;
}) => (
    <AdminContext
        i18nProvider={i18nProvider}
        defaultTheme="light"
        theme={theme}
    >
        <Create resource="posts">
            <SimpleForm {...simpleFormProps}>
                {children}
                <FormInspector name="published" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const DateHelper = ({
    source,
    value,
}: {
    source: string;
    value: string | Date;
}) => {
    const record = useRecordContext();
    const { resetField, setValue } = useFormContext();
    const currentValue = useWatch({ name: source });

    return (
        <Box>
            <Typography>
                Record value: {get(record, source)?.toString() ?? '-'}
            </Typography>
            <Typography>
                Current value: <span>{currentValue?.toString() ?? '-'}</span>
            </Typography>
            <Button
                onClick={() => {
                    setValue(source, value, { shouldDirty: true });
                }}
                type="button"
            >
                Change value
            </Button>
            <Button
                color="error"
                onClick={() => {
                    resetField(source);
                }}
                type="button"
            >
                Reset
            </Button>
        </Box>
    );
};
