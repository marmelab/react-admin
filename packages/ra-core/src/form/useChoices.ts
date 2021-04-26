import { ReactElement, isValidElement, cloneElement, useCallback } from 'react';
import get from 'lodash/get';

import { useTranslate } from '../i18n';
import { Record } from '../types';
import { InputProps } from '.';

export type OptionTextElement = ReactElement<{
    record: Record;
}>;
export type OptionTextFunc = (choice: object) => string | OptionTextElement;
export type OptionText = OptionTextElement | OptionTextFunc | string;

export interface ChoicesInputProps<T = any>
    extends Omit<InputProps<T>, 'source'> {
    // Optional as choices inputs can be used inside Reference inputs which inject the source
    source?: string;

    // Optional as choices inputs can be used inside Reference inputs which inject the choices
    choices?: object[];
}

export interface ChoicesProps {
    choices: object[];
    optionValue?: string;
    optionText?: OptionText;
    translateChoice?: boolean;
}

export interface UseChoicesOptions {
    optionValue?: string;
    optionText?: OptionText;
    disableValue?: string;
    translateChoice?: boolean;
}

/*
 * Returns helper functions for choices handling.
 *
 * @param optionText Either a string defining the property to use to get the choice text, a function or a React element
 * @param optionValue The property to use to get the choice value
 * @param translateChoice A boolean indicating whether to option text should be translated
 *
 * @returns An object with helper functions:
 * - getChoiceText: Returns the choice text or a React element
 * - getChoiceValue: Returns the choice value
 */
const useChoices = ({
    optionText = 'name',
    optionValue = 'id',
    disableValue = 'disabled',
    translateChoice = true,
}: UseChoicesOptions) => {
    const translate = useTranslate();

    const getChoiceText = useCallback(
        choice => {
            if (isValidElement<{ record: any }>(optionText)) {
                return cloneElement<{ record: any }>(optionText, {
                    record: choice,
                });
            }
            const choiceName =
                typeof optionText === 'function'
                    ? optionText(choice)
                    : get(choice, optionText);

            return translateChoice
                ? translate(choiceName, { _: choiceName })
                : choiceName;
        },
        [optionText, translate, translateChoice]
    );

    const getChoiceValue = useCallback(choice => get(choice, optionValue), [
        optionValue,
    ]);

    const getDisableValue = useCallback(choice => get(choice, disableValue), [
        disableValue,
    ]);

    return {
        getChoiceText,
        getChoiceValue,
        getDisableValue,
    };
};

export default useChoices;
