import { ReactElement, isValidElement, cloneElement } from 'react';
import get from 'lodash/get';

import { Identifier } from '../types';
import { useTranslate } from '../i18n';

export interface Choice {
    [key: string]: string | Identifier;
}

export type OptionTextElement = ReactElement<{ record: Choice }>;
export type OptionText = (choice: Choice) => string | OptionTextElement;

export interface ChoicesProps {
    choices: Choice[];
    optionValue: string;
    optionText: OptionTextElement | OptionText | string;
    translateChoice: boolean;
}

const useChoices = ({ optionText, optionValue, translateChoice }) => {
    const translate = useTranslate();

    const getChoiceText = choice => {
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
    };

    const getChoiceValue = choice => get(choice, optionValue);

    return {
        getChoiceText,
        getChoiceValue,
    };
};

export default useChoices;
