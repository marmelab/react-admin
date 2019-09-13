import { ReactElement, isValidElement, cloneElement } from 'react';
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

interface Options {
    optionValue?: string;
    optionText?: OptionTextElement | OptionText | string;
    translateChoice?: boolean;
}

const useChoices = ({
    optionText = 'name',
    optionValue = 'id',
    translateChoice = true,
}: Options) => {
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
