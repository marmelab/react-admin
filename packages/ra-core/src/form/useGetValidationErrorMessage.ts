import {
    ValidationErrorMessage,
    ValidationErrorMessageWithArgs,
} from './validate';
import { useTranslate } from '../i18n';

/**
 * This hook returns a function that can translate an error message. It handles simple string errors and those which have a message and args.
 * @see ValidationErrorMessage
 * @see ValidationErrorMessageWithArgs
 */
export const useGetValidationErrorMessage = () => {
    const translate = useTranslate();

    return (error: ValidationErrorMessage) => {
        if ((error as ValidationErrorMessageWithArgs).message != null) {
            const { message, args } = error as ValidationErrorMessageWithArgs;
            return translate(message, { _: message, ...args });
        }
        return translate(error as string, { _: error });
    };
};
