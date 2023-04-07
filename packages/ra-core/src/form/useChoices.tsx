import * as React from 'react';
import { ReactElement, isValidElement, useCallback } from 'react';
import get from 'lodash/get';
import { Call, Objects } from 'hotscript';

import { useTranslate } from '../i18n';
import { RaRecord } from '../types';
import { RecordContextProvider } from '../controller';

export type OptionTextElement = ReactElement<{
    record: RaRecord;
}>;
export type OptionTextFunc<RecordType = unknown> = (
    choice: unknown extends RecordType ? any : RecordType
) => React.ReactNode;

export type OptionText<RecordType = unknown> =
    | OptionTextElement
    | OptionTextFunc<RecordType>
    | (unknown extends RecordType
          ? string
          : Call<Objects.AllPaths, RecordType>);

export interface ChoicesProps<RecordType = unknown> {
    choices?: any[];
    isFetching?: boolean;
    isLoading?: boolean;
    optionValue?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
    optionText?: OptionText<RecordType>;
    translateChoice?: boolean;
}

export interface UseChoicesOptions<RecordType = unknown> {
    optionValue?: string;
    optionText?: OptionText<RecordType>;
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
export const useChoices = <
    RecordType extends Record<string, unknown> = Record<string, unknown>
>({
    optionText,
    optionValue = 'id',
    disableValue = 'disabled',
    translateChoice = true,
}: UseChoicesOptions<RecordType>) => {
    const translate = useTranslate();

    const getChoiceText = useCallback(
        choice => {
            if (isValidElement<{ record: any }>(optionText)) {
                return (
                    <RecordContextProvider value={choice}>
                        {optionText}
                    </RecordContextProvider>
                );
            }
            const choiceName =
                typeof optionText === 'function'
                    ? optionText(choice)
                    : get(choice, optionText ?? 'name');

            return isValidElement(choiceName)
                ? choiceName
                : translateChoice
                ? translate(String(choiceName), { _: choiceName })
                : String(choiceName);
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
