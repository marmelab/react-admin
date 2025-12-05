import * as React from 'react';
import {
    SupportCreateSuggestionOptions,
    useSupportCreateSuggestion,
    useCreateSuggestionContext,
} from './useSupportCreateSuggestion';
import { CreateBase } from '../create/CreateBase';
import { SimpleForm, TextInput } from '../../test-ui';
import { CoreAdminContext } from '../../core/CoreAdminContext';
import { DataProvider } from '../../types';

export default { title: 'ra-core/controller/input/useSupportCreateSuggestion' };

const CreateElement = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();

    return (
        <CreateBase
            redirect={false}
            resource="authors"
            mutationOptions={{
                onSuccess: onCreate,
            }}
        >
            <SimpleForm defaultValues={{ foo: filter }}>
                <TextInput source="foo" />
                <TextInput source="bar" />
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </SimpleForm>
        </CreateBase>
    );
};

export const UseSupportCreateSuggestion = (
    options: Pick<
        SupportCreateSuggestionOptions,
        | 'createLabel'
        | 'createItemLabel'
        | 'createValue'
        | 'createHintValue'
        | 'optionText'
    > & { withCreateElement?: boolean }
) => {
    const [value, setValue] = React.useState<string>('');
    const [filter, setFilter] = React.useState<string>('');
    const [createParams, setCreateParams] = React.useState<any>(null);
    const [onCreateParams, setOnCreateParams] = React.useState<any>(null);

    const { withCreateElement, ...rest } = options;

    const {
        createId,
        createHintId,
        getCreateItem,
        handleChange,
        createElement,
        getOptionDisabled,
    } = useSupportCreateSuggestion({
        filter,
        handleChange: eventOrValue => {
            setValue(eventOrValue?.target?.value ?? eventOrValue.id);
        },
        onCreate: withCreateElement
            ? undefined
            : arg => {
                  setOnCreateParams(arg);
                  return { id: 'new_id_from_onCreate' };
              },
        create: withCreateElement ? <CreateElement /> : undefined,
        ...rest,
    });

    const createItem = getCreateItem(filter);
    const disabled = getOptionDisabled(createItem);

    const dataProvider = {
        create: async (_, args) => {
            setCreateParams(args);
            return { data: { id: 'new_id_from_create' } };
        },
    } as unknown as DataProvider;

    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <fieldset>
                <legend>Return values</legend>
                <pre>{JSON.stringify({ createId, createHintId }, null, 2)}</pre>
            </fieldset>
            <fieldset>
                <legend>Create Item</legend>
                <pre>{JSON.stringify({ createItem, disabled }, null, 2)}</pre>
            </fieldset>
            <form>
                <fieldset>
                    <legend>Inputs</legend>
                    <label htmlFor="autocomplete-value">
                        Autocomplete value
                    </label>
                    &nbsp;
                    <input
                        id="autocomplete-value"
                        value={value || ''}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            handleChange(createItem.id);
                        }}
                        disabled={disabled}
                    >
                        Simulate click on create
                    </button>
                    <br />
                    <label htmlFor="autocomplete-filter">
                        Autocomplete filter
                    </label>
                    &nbsp;
                    <input
                        id="autocomplete-filter"
                        value={filter || ''}
                        onChange={e => setFilter(e.target.value)}
                    />
                </fieldset>
            </form>
            {withCreateElement ? (
                <>
                    <fieldset>
                        <legend>Create Element</legend>
                        {createElement}
                    </fieldset>
                    <fieldset>
                        <legend>Called create with</legend>
                        <pre>{JSON.stringify(createParams, null, 2)}</pre>
                    </fieldset>
                </>
            ) : (
                <fieldset>
                    <legend>Called onCreate with</legend>
                    <pre>{JSON.stringify(onCreateParams, null, 2)}</pre>
                </fieldset>
            )}
        </CoreAdminContext>
    );
};
UseSupportCreateSuggestion.argTypes = {
    createLabel: { control: 'text' },
    createItemLabel: { control: 'text' },
    createValue: { control: 'text' },
    createHintValue: { control: 'text' },
    optionText: { control: 'text' },
    withCreateElement: { control: 'boolean' },
};
