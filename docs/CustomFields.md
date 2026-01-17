# Custom Fields

This document explains how to create custom field components in react-admin that integrate seamlessly with the rest of the framework.

## Basic Structure

A custom field component should:

1. Extend the `FieldProps` interface
2. Use the `useFieldValue` hook to get the field value
3. Handle empty values appropriately
4. Support translation
5. Support the common field props (label, source, etc.)

Here's a basic example:

```tsx
import * as React from 'react';
import { Typography } from '@mui/material';
import { useFieldValue, useTranslate, FieldProps } from 'react-admin';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';

export const CustomField = <RecordType extends Record<string, any> = Record<string, any>>(
    props: CustomFieldProps<RecordType>
) => {
    const { className, emptyText, ...rest } = props;
    const value = useFieldValue(props);
    const translate = useTranslate();

    if (value == null) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {translate(emptyText, { _: emptyText })}
            </Typography>
        ) : null;
    }

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {value}
        </Typography>
    );
};

export interface CustomFieldProps<
    RecordType extends Record<string, any> = Record<string, any>
> extends FieldProps<RecordType> {
    // Add any custom props here
}
```

## Using defaultProps for Labels

When creating a custom field component, it's recommended to use `defaultProps` to set default values for the `label` prop. This ensures consistent behavior across your application and makes the component more reusable.

Here's how to implement it:

```tsx
import * as React from 'react';
import { Typography } from '@mui/material';
import { useFieldValue, useTranslate, FieldProps } from 'react-admin';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';

export const CustomField = <RecordType extends Record<string, any> = Record<string, any>>(
    props: CustomFieldProps<RecordType>
) => {
    // ... component implementation
};

CustomField.defaultProps = {
    label: 'Custom Field', // Default label
    addLabel: true, // Show label by default
};

export interface CustomFieldProps<
    RecordType extends Record<string, any> = Record<string, any>
> extends FieldProps<RecordType> {
    // Add any custom props here
}
```

The benefits of using `defaultProps` for labels include:

1. **Consistency**: All instances of your field will have a default label if none is provided
2. **Type Safety**: TypeScript will know about the default values
3. **Documentation**: It makes it clear what the default behavior is
4. **Maintainability**: You can change the default value in one place

## Best Practices

1. **Always extend FieldProps**: This ensures your component supports all standard field props like `source`, `label`, `emptyText`, etc.

2. **Use defaultProps for common values**: Set sensible defaults for `label` and other commonly used props.

3. **Handle empty values**: Always check for null/undefined values and use the `emptyText` prop appropriately.

4. **Support translation**: Use the `useTranslate` hook for all user-facing strings, including the default label.

5. **Use sanitizeFieldRestProps**: This utility function removes field-specific props before passing them to the underlying component.

6. **Type your props properly**: Use generics to ensure type safety with your record type.

## Example with All Best Practices

```tsx
import * as React from 'react';
import { Typography } from '@mui/material';
import { useFieldValue, useTranslate, FieldProps } from 'react-admin';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';

export const CustomField = <RecordType extends Record<string, any> = Record<string, any>>(
    props: CustomFieldProps<RecordType>
) => {
    const { className, emptyText, ...rest } = props;
    const value = useFieldValue(props);
    const translate = useTranslate();

    if (value == null) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {translate(emptyText, { _: emptyText })}
            </Typography>
        ) : null;
    }

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {translate(value.toString())}
        </Typography>
    );
};

CustomField.defaultProps = {
    label: 'custom.field', // Translation key for default label
    addLabel: true,
    emptyText: 'custom.field.empty', // Translation key for empty state
};

export interface CustomFieldProps<
    RecordType extends Record<string, any> = Record<string, any>
> extends FieldProps<RecordType> {
    // Add any custom props here
}
```

## Usage

```tsx
// Basic usage with default label
<CustomField source="name" />

// Override default label
<CustomField source="name" label="Custom Name" />

// Disable label
<CustomField source="name" label={false} />

// Custom empty text
<CustomField source="name" emptyText="No name provided" />
```

Remember to add translations for your default labels and empty text messages in your translation files. 