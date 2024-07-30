import * as React from 'react';
import {
    useResourceContext,
    usePreference,
    useStore,
    useTranslate,
} from 'ra-core';

import { Configurable } from '../preferences';
import { SimpleForm, SimpleFormProps } from './SimpleForm';
import { SimpleFormEditor } from './SimpleFormEditor';

export const SimpleFormConfigurable = ({
    preferenceKey,
    omit,
    ...props
}: SimpleFormConfigurableProps) => {
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const finalPreferenceKey = preferenceKey || `${resource}.simpleForm`;

    const [availableInputs, setAvailableInputs] = useStore<
        SimpleFormConfigurableColumn[]
    >(`preferences.${finalPreferenceKey}.availableInputs`, EMPTY_ARRAY);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setOmit] = useStore<string[]>(
        `preferences.${finalPreferenceKey}.omit`,
        omit
    );

    React.useEffect(() => {
        // first render, or the preference have been cleared
        const inputs =
            React.Children.map(props.children, (child, index) =>
                React.isValidElement(child)
                    ? {
                          index: String(index),
                          source: child.props.source,
                          label:
                              child.props.source || child.props.label
                                  ? child.props.label
                                  : translate(
                                        'ra.configurable.SimpleForm.unlabeled',
                                        {
                                            input: index,
                                            _: `Unlabeled input #%{input}`,
                                        }
                                    ),
                      }
                    : null
            )?.filter(column => column != null) ?? EMPTY_ARRAY;
        if (inputs.length !== availableInputs.length) {
            setAvailableInputs(inputs);
            setOmit(omit || EMPTY_ARRAY);
        }
    }, [availableInputs]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Configurable
            editor={<SimpleFormEditor />}
            preferenceKey={finalPreferenceKey}
            sx={{
                display: 'block',
                '&.RaConfigurable-editMode': {
                    margin: '2px',
                },
            }}
        >
            <SimpleFormWithPreferences {...props} />
        </Configurable>
    );
};

const EMPTY_ARRAY: any[] = [];

export interface SimpleFormConfigurableProps extends SimpleFormProps {
    /**
     * Key to use to store the user's preferences for this SimpleForm.
     *
     * Set to '[resource].simpleForm' by default. Pass a custom key if you need
     * to display more than one SimpleFormConfigurable per resource.
     */
    preferenceKey?: string;
    /**
     * columns to hide by default
     *
     * @example
     * // by default, hide the id and author columns
     * // users can choose to show show them in configuration mode
     * const PostEdit = () => (
     *     <Edit>
     *         <SimpleFormConfigurable omit={['id', 'author']}>
     *             <TextInput source="id" />
     *             <TextInput source="title" />
     *             <TextInput source="author" />
     *             <TextInput source="year" />
     *         </SimpleFormConfigurable>
     *     </Edit>
     * );
     */
    omit?: string[];
}

export interface SimpleFormConfigurableColumn {
    index: string;
    source: string;
    label?: string;
}

/**
 * This SimpleForm filters its children depending on preferences
 */
const SimpleFormWithPreferences = ({ children, ...props }: SimpleFormProps) => {
    const [availableInputs] = usePreference<SimpleFormConfigurableColumn[]>(
        'availableInputs',
        []
    );
    const [omit] = usePreference<string[]>('omit', []);
    const [inputs] = usePreference(
        'inputs',
        availableInputs
            .filter(input => !omit?.includes(input.source))
            .map(input => input.index)
    );
    const childrenArray = React.Children.toArray(children);
    return (
        <SimpleForm {...props}>
            {inputs === undefined
                ? children
                : inputs.map(index => childrenArray[index])}
        </SimpleForm>
    );
};
