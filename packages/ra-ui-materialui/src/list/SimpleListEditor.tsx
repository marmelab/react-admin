import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useTranslate, useStore, useResourceContext } from 'ra-core';

import { ResetSettingsButton } from '../configurable//ResetSettingsButton';

/**
 * A component which provides a configuration UI to tweak the SimpleList
 *
 * @param {SimpleListEditorProps} props
 * @param props.defaultPrimaryText The SimpleList columns
 * @param {String} props.resource The resource
 * @param {String} props.preferencesKey The key of the columns preferences
 */
export const SimpleListEditor = (props: SimpleListEditorProps) => {
    const {
        defaultPrimaryText,
        defaultSecondaryText,
        defaultTertiatyText,
        preferencesKey,
    } = props;
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const rootKey = `simpleList.${preferencesKey || resource}`;

    const primaryTextKey = `${rootKey}.primaryText`;
    const [
        primaryText,
        handlePrimaryTextChange,
        handlePrimaryTextBlur,
    ] = usePreferenceInput(primaryTextKey, defaultPrimaryText);
    const secondaryTextKey = `${rootKey}.secondaryText`;
    const [
        secondaryText,
        handleSecondaryTextChange,
        handleSecondaryTextBlur,
    ] = usePreferenceInput(secondaryTextKey, defaultSecondaryText);
    const tertiaryTextKey = `${rootKey}.tertiaryText`;
    const [
        tertiaryText,
        handleTertiaryTextChange,
        handleTertiaryTextBlur,
    ] = usePreferenceInput(tertiaryTextKey, defaultTertiatyText);

    return (
        <>
            <TextField
                label={translate('rainspector.SimpleList.primaryText', {
                    _: 'Primary Text',
                })}
                value={primaryText || ''}
                onChange={handlePrimaryTextChange}
                onBlur={handlePrimaryTextBlur}
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
            />
            <TextField
                label={translate('rainspector.SimpleList.secondaryText', {
                    _: 'Secondary Text',
                })}
                value={secondaryText || ''}
                onChange={handleSecondaryTextChange}
                onBlur={handleSecondaryTextBlur}
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
            />
            <TextField
                label={translate('rainspector.SimpleList.tertiaryText', {
                    _: 'Tertiary Text',
                })}
                value={tertiaryText || ''}
                onChange={handleTertiaryTextChange}
                onBlur={handleTertiaryTextBlur}
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
            />

            <ResetSettingsButton
                preferencesKeys={[
                    primaryTextKey,
                    secondaryTextKey,
                    tertiaryTextKey,
                ]}
            />
        </>
    );
};

export interface SimpleListEditorProps {
    resource?: string;
    preferencesKey?: string;
    defaultPrimaryText?: string;
    defaultSecondaryText?: string;
    defaultTertiatyText?: string;
}

const usePreferenceInput = (key, defaultValue) => {
    const [valueFromStore, setValueFromStore] = useStore(key);
    const [value, setValue] = useState(valueFromStore || defaultValue);
    useEffect(() => {
        setValue(valueFromStore || defaultValue);
    }, [valueFromStore, defaultValue]);
    const handleChange = event => {
        setValue(event.target.value === '' ? undefined : event.target.value);
    };
    const handleBlur = () => {
        setValueFromStore(value);
    };
    return [value, handleChange, handleBlur];
};
