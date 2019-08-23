import { ReactElement } from 'react';

type OptionTextFunction<ChoiceType = any> = (record: ChoiceType) => string;

export interface InputWithOptionsProps<ChoiceType = any> {
    choices: ChoiceType[];
    optionText?:
        | string
        | OptionTextFunction<ChoiceType>
        | ReactElement<{ record: ChoiceType }>;
    optionValue?: string;
}
