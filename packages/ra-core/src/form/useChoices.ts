import { ReactElement, isValidElement, cloneElement, useCallback } from 'react';
import get from 'lodash/get';

import { useTranslate } from '../i18n';
import { Record } from '../types';

export type OptionTextElement = ReactElement<{
    record: Record;
}>;
export type OptionText = (choice: object) => string | OptionTextElement;

export interface ChoicesProps {
    choices: object[];
    optionValue?: string;
    optionText?: OptionTextElement | OptionText | string;
    translateChoice?: boolean;
}

export interface UseChoicesOptions {
    optionValue?: string;
    optionText?: OptionTextElement | OptionText | string;
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

    return {
        getChoiceText,
        getChoiceValue,
    };
};

export default useChoices;
