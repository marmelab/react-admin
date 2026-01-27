import * as React from 'react';
import clsx from 'clsx';
import {
    isRequired,
    FieldTitle,
    useSourceContext,
    ArrayInputBase,
    type ArrayInputBaseProps,
} from 'ra-core';
import { useFormContext } from 'react-hook-form';
import {
    InputLabel,
    FormControl,
    FormHelperText,
    type FormControlProps,
    styled,
    type ComponentsOverrides,
    useThemeProps,
} from '@mui/material';
import get from 'lodash/get.js';

import { LinearProgress } from '../../layout/LinearProgress';
import { InputHelperText } from '../InputHelperText';
import { sanitizeInputRestProps } from '../sanitizeInputRestProps';
import { Labeled } from '../../Labeled';

/**
 * To edit arrays of data embedded inside a record, <ArrayInput> creates a list of sub-forms.
 *
 *  @example
 *
 *      import { ArrayInput, SimpleFormIterator, DateInput, TextInput } from 'react-admin';
 *
 *      <ArrayInput source="backlinks">
 *          <SimpleFormIterator>
 *              <DateInput source="date" />
 *              <TextInput source="url" />
 *          </SimpleFormIterator>
 *      </ArrayInput>
 *
 * <ArrayInput> allows the edition of embedded arrays, like the backlinks field
 * in the following post record:
 *
 * {
 *   id: 123
 *   backlinks: [
 *         {
 *             date: '2012-08-10T00:00:00.000Z',
 *             url: 'http://example.com/foo/bar.html',
 *         },
 *         {
 *             date: '2012-08-14T00:00:00.000Z',
 *             url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
 *         }
 *    ]
 * }
 *
 * <ArrayInput> expects a single child, which must be a *form iterator* component.
 * A form iterator is a component accepting a fields object as passed by
 * react-hook-form-arrays's useFieldArray() hook, and defining a layout for
 * an array of fields. For instance, the <SimpleFormIterator> component
 * displays an array of fields in an unordered list (<ul>), one sub-form by
 * list item (<li>). It also provides controls for adding and removing
 * a sub-record (a backlink in this example).
 *
 * @see {@link https://react-hook-form.com/docs/usefieldarray}
 */
export const ArrayInput = (inProps: ArrayInputProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        className,
        defaultValue = [],
        label,
        children,
        helperText,
        isPending,
        resource: resourceFromProps,
        source: arraySource,
        validate,
        variant,
        margin = 'dense',
        ...rest
    } = props;

    const parentSourceContext = useSourceContext();
    const finalSource = parentSourceContext.getSource(arraySource);
    const { subscribe } = useFormContext();

    const [error, setError] = React.useState<any>();
    React.useEffect(() => {
        return subscribe({
            formState: { errors: true },
            callback: ({ errors }) => {
                const error = get(errors ?? {}, finalSource);
                setError(error);
            },
        });
    }, [finalSource, subscribe]);
    const renderHelperText = helperText !== false || !!error;

    if (isPending) {
        // We handle the loading state here instead of using the loading prop
        // of ArrayInputBase to avoid wrapping the content below inside Root
        return (
            <Labeled label={label} className={className}>
                <LinearProgress />
            </Labeled>
        );
    }

    return (
        <Root
            fullWidth
            margin={margin}
            className={clsx(
                'ra-input',
                `ra-input-${finalSource}`,
                ArrayInputClasses.root,
                className
            )}
            error={!!error}
            {...sanitizeInputRestProps(rest)}
        >
            <InputLabel
                component="span"
                className={ArrayInputClasses.label}
                shrink
                error={!!error}
            >
                <FieldTitle
                    label={label}
                    source={arraySource}
                    resource={resourceFromProps}
                    isRequired={isRequired(validate)}
                />
            </InputLabel>
            {/*
                We must put the ArrayInputBase inside Root so that the FieldTitle above
                is not inside the ArrayInputBase's SourceContext,
                Otherwise, the ArrayInput label translation key would be wrong
            */}
            <ArrayInputBase {...props} defaultValue={defaultValue}>
                {children}
            </ArrayInputBase>
            {renderHelperText ? (
                <FormHelperText error={!!error}>
                    <InputHelperText
                        // root property is applicable to built-in validation only,
                        // Resolvers are yet to support useFieldArray root level validation.
                        // Reference: https://react-hook-form.com/docs/usefieldarray
                        error={error?.root?.message ?? error?.message}
                        helperText={helperText}
                    />
                </FormHelperText>
            ) : null}
        </Root>
    );
};

export interface ArrayInputProps
    extends ArrayInputBaseProps,
        Omit<
            FormControlProps,
            | 'children'
            | 'defaultValue'
            | 'disabled'
            | 'readOnly'
            | 'onBlur'
            | 'onChange'
        > {
    className?: string;
    loading?: React.ReactNode;
    isFetching?: boolean;
    isLoading?: boolean;
    isPending?: boolean;
}

const PREFIX = 'RaArrayInput';

export const ArrayInputClasses = {
    root: `${PREFIX}-root`,
    label: `${PREFIX}-label`,
};

const Root = styled(FormControl, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    marginTop: 0,
    [`& .${ArrayInputClasses.label}`]: {
        position: 'relative',
        top: theme.spacing(0.5),
        left: theme.spacing(-1.5),
    },
    [`& .${ArrayInputClasses.root}`]: {
        // nested ArrayInput
        paddingLeft: theme.spacing(2),
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaArrayInput: 'root' | 'label';
    }

    interface ComponentsPropsList {
        RaArrayInput: Partial<ArrayInputProps>;
    }

    interface Components {
        RaArrayInput?: {
            defaultProps?: ComponentsPropsList['RaArrayInput'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaArrayInput'];
        };
    }
}
