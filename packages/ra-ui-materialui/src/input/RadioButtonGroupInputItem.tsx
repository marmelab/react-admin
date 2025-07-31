import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { type ChoicesProps, useChoices } from 'ra-core';
import { FormControlLabelProps } from '@mui/material';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';

export const RadioButtonGroupInputItem = (
    props: RadioButtonGroupInputItemProps
) => {
    const {
        choice,
        optionText,
        optionValue,
        source,
        translateChoice,
        disableValue = 'disabled',
        ...rest
    } = useThemeProps({
        props: props,
        name: PREFIX,
    });

    const { getChoiceText, getChoiceValue, getDisableValue } = useChoices({
        optionText,
        optionValue,
        translateChoice,
        disableValue,
    });
    const label = getChoiceText(choice);
    const value = getChoiceValue(choice);
    const disabled = getDisableValue(choice);

    const nodeId = `${source}_${value}`;

    return (
        <StyledFormControlLabel
            label={label}
            htmlFor={nodeId}
            value={value}
            disabled={disabled}
            control={<Radio id={nodeId} color="primary" />}
            {...sanitizeInputRestProps(rest)}
        />
    );
};

export default RadioButtonGroupInputItem;

export interface RadioButtonGroupInputItemProps
    extends Omit<FormControlLabelProps, 'control' | 'label'>,
        Pick<
            ChoicesProps,
            'optionValue' | 'optionText' | 'translateChoice' | 'disableValue'
        > {
    choice: any;
    source: any;
}

const PREFIX = 'RaRadioButtonGroupInputItem';

const StyledFormControlLabel = styled(FormControlLabel, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<RadioButtonGroupInputItemProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
