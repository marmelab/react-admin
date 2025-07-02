import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    Checkbox,
    type CheckboxProps,
    FormControlLabel,
    type FormControlLabelProps,
} from '@mui/material';
import { type ChoicesProps, useChoices } from 'ra-core';

export const CheckboxGroupInputItem = (
    inProps: CheckboxGroupInputItemProps
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        id,
        choice,
        className,
        fullWidth,
        onChange,
        optionText,
        optionValue,
        options,
        translateChoice,
        value,
        labelPlacement,
        inputRef,
        disableValue = 'disabled',
        ...rest
    } = props;

    const { getChoiceText, getChoiceValue, getDisableValue } = useChoices({
        optionText,
        optionValue,
        translateChoice,
        disableValue,
    });

    const choiceName = getChoiceText(choice);
    const disabled = getDisableValue(choice);

    return (
        <StyledFormControlLabel
            htmlFor={`${id}_${getChoiceValue(choice)}`}
            key={getChoiceValue(choice)}
            onChange={onChange}
            className={className}
            inputRef={inputRef}
            control={
                <Checkbox
                    id={`${id}_${getChoiceValue(choice)}`}
                    color="primary"
                    className={CheckboxGroupInputItemClasses.checkbox}
                    checked={
                        value
                            ? value.find(v => v == getChoiceValue(choice)) !== // eslint-disable-line eqeqeq
                              undefined
                            : false
                    }
                    value={String(getChoiceValue(choice))}
                    disabled={disabled}
                    {...options}
                />
            }
            label={choiceName}
            labelPlacement={labelPlacement}
            {...rest}
        />
    );
};

export interface CheckboxGroupInputItemProps
    extends Omit<FormControlLabelProps, 'control' | 'label'>,
        Pick<
            ChoicesProps,
            'optionValue' | 'optionText' | 'translateChoice' | 'disableValue'
        > {
    choice: any;
    value: any;
    fullWidth?: boolean;
    options?: CheckboxProps;
}

const PREFIX = 'RaCheckboxGroupInputItem';

export const CheckboxGroupInputItemClasses = {
    checkbox: `${PREFIX}-checkbox`,
};

const StyledFormControlLabel = styled(FormControlLabel, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${CheckboxGroupInputItemClasses.checkbox}`]: {
        height: 32,
    },
});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaCheckboxGroupInputItem: 'root' | 'checkbox';
    }

    interface ComponentsPropsList {
        RaCheckboxGroupInputItem: Partial<CheckboxGroupInputItemProps>;
    }

    interface Components {
        RaCheckboxGroupInputItem?: {
            defaultProps?: ComponentsPropsList['RaCheckboxGroupInputItem'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaCheckboxGroupInputItem'];
        };
    }
}
