import {
    ValidationErrorMessage,
    ValidationErrorMessageWithArgs,
} from './validate';
import { useTranslate } from '../i18n';

/**
 * @deprecated
 * This internal hook returns a function that can translate an error message.
 * It handles simple string errors and those which have a message and args.
 * Only useful if you are implementing custom inputs without leveraging our useInput hook.
 *
 * @example
 * const MyInput = props => {
 *      const { field, fieldState } = useController(props);
 *      useEffect(() => {
 *          if (fieldState.error) {
 *              const errorMessage = useGetValidationErrorMessage(fieldState.error);
 *              alert(errorMessage);
 *          }
 *      }, [fieldState.error]);
 *
 *      return (
 *          <input {...field} />
 *      );
 * }
 *
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
