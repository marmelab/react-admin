import * as React from 'react';
import {
    ChangeEvent,
    createContext,
    isValidElement,
    ReactElement,
    useContext,
    useState,
} from 'react';
import { useTranslate } from 'ra-core';
import { useForm } from 'react-final-form';

/**
 * This hook provides support for suggestion creation in inputs which have choices.
 *
 * @param options The hook option
 * @param {ReactElement} options.create A react element which will be rendered when users choose to create a new choice. This component must call the `useCreateSuggestion` hook which provides `onCancel`, `onCreate` and `filter`. See the examples.
 * @param {String} options.createLabel Optional. The label for the choice item allowing users to create a new choice. Can be a translation key. Defaults to `ra.action.create`.
 * @param {String} options.createItemLabel Optional. The label for the choice item allowing users to create a new choice when they already entered a filter. Can be a translation key. The translation will receive an `item` parameter. Defaults to `ra.action.create_item`.
 * @param {any} options.createValue Optional. The value for the choice item allowing users to create a new choice. Defaults to `@@ra-create`.
 * @param {String} options.filter Optional. The filter users may have already entered. Useful for autocomplete inputs for example.
 * @param {OnCreateHandler} options.onCreate Optional. A function which will be called when users choose to create a new choice, if the `create` option wasn't provided.
 * @param {String} options.source The input source. Used to trigger a form change upon successful creation.
 * @returns {UseSupportCreateValue} An object with the following properties:
 * - getCreateItemLabel: a function which will return the label of the choice for create a new choice.
 * - handleChange: a function to pass to the input. Accept the event or the value selected and the original onChange handler of the input. This original handler will be called if users haven't asked to create a new choice.
 * - createElement: a React element to render after the input. It will be rendered when users choose to create a new choice. It renders null otherwise.
 */
export const useSupportCreateSuggestion = (
    options: SupportCreateSuggestionOptions
): UseSupportCreateValue => {
    const {
        create,
        createLabel = 'ra.action.create',
        createItemLabel = 'ra.action.create_item',
        createValue = '@@ra-create',
        filter,
        onCreate,
        source,
    } = options;
    const translate = useTranslate();
    const form = useForm();
    const [renderOnCreate, setRenderOnCreate] = useState(false);

    const context = {
        filter,
        onCancel: () => setRenderOnCreate(false),
        onCreate: (value, item) => {
            setRenderOnCreate(false);
            form.change(source, value);
        },
    };

    return {
        getCreateItemLabel: () => {
            return filter && createItemLabel
                ? translate(createItemLabel, {
                      item: filter,
                      _: createItemLabel,
                  })
                : translate(createLabel, { _: createLabel });
        },
        handleChange: async (eventOrValue, handleChange) => {
            const value = eventOrValue.target?.value || eventOrValue;

            if (value === createValue) {
                if (!isValidElement(create)) {
                    const newSuggestion = await onCreate(filter);

                    if (newSuggestion) {
                        form.change(source, value);
                        return;
                    }
                } else {
                    setRenderOnCreate(true);
                    return;
                }
            }
            handleChange();
        },
        createElement:
            renderOnCreate && isValidElement(create) ? (
                <CreateSuggestionContext.Provider value={context}>
                    {create}
                </CreateSuggestionContext.Provider>
            ) : null,
    };
};

export interface SupportCreateSuggestionOptions {
    create?: ReactElement;
    createValue?: string;
    createLabel?: string;
    createItemLabel?: string;
    filter?: string;
    onCreate?: OnCreateHandler;
    source: string;
}

export interface UseSupportCreateValue {
    getCreateItemLabel: () => string;
    handleChange: (
        eventOrValue: ChangeEvent | any,
        handleChange: (value?: any) => void
    ) => Promise<void>;
    createElement: ReactElement | null;
}

const CreateSuggestionContext = createContext<CreateSuggestionContextValue>(
    undefined
);

interface CreateSuggestionContextValue {
    filter?: string;
    onCreate: (value: any, choice: any) => void;
    onCancel: () => void;
}
export const useCreateSuggestion = () => useContext(CreateSuggestionContext);

export type OnCreateHandler = (filter?: string) => any | Promise<any>;
