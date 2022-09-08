import * as React from 'react';
import { TextField } from '@mui/material';
import { useTranslate, useResourceContext, usePreferenceInput } from 'ra-core';

import { ResetSettingsButton } from '../../preferences/ResetSettingsButton';

/**
 * A component which provides a configuration UI to tweak the SimpleList
 *
 * @param {SimpleListEditorProps} props
 * @param props.defaultPrimaryText The SimpleList columns
 * @param {String} props.resource The resource
 * @param {String} props.preferenceKey The key of the columns preferences
 */
export const SimpleListEditor = (props: SimpleListEditorProps) => {
    const {
        defaultPrimaryText = '',
        defaultSecondaryText = '',
        defaultTertiatyText = '',
        preferenceKey,
    } = props;

    const translate = useTranslate();
    const resource = useResourceContext(props);
    const rootKey = `preferences.simpleList.${preferenceKey || resource}`;

    const primaryTextKey = `${rootKey}.primaryText`;
    const primaryTextField = usePreferenceInput(
        primaryTextKey,
        defaultPrimaryText
    );
    const secondaryTextKey = `${rootKey}.secondaryText`;
    const secondaryTextField = usePreferenceInput(
        secondaryTextKey,
        defaultSecondaryText
    );
    const tertiaryTextKey = `${rootKey}.tertiaryText`;
    const tertiaryTextField = usePreferenceInput(
        tertiaryTextKey,
        defaultTertiatyText
    );

    return (
        <>
            <TextField
                label={translate('ra.configurable.SimpleList.primaryText', {
                    _: 'Primary Text',
                })}
                {...primaryTextField}
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
            />
            <TextField
                label={translate('ra.configurable.SimpleList.secondaryText', {
                    _: 'Secondary Text',
                })}
                {...secondaryTextField}
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
            />
            <TextField
                label={translate('ra.configurable.SimpleList.tertiaryText', {
                    _: 'Tertiary Text',
                })}
                {...tertiaryTextField}
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
            />

            <ResetSettingsButton
                preferenceKeys={[
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
    preferenceKey?: string;
    defaultPrimaryText?: string;
    defaultSecondaryText?: string;
    defaultTertiatyText?: string;
}
