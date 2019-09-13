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
