import * as React from 'react';
import fakerestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Form } from './Form';
import { useInput } from './useInput';
import {
    CoreAdminContext,
    CreateBase,
    DataProvider,
    FormDataConsumer,
    mergeTranslations,
    useUnique,
} from '..';
import { QueryClient } from 'react-query';

export default {
    title: 'ra-core/form/useUnique',
};

const Input = props => {
    const { field, fieldState } = useInput(props);
    return (
        <>
            <input
                aria-label="name"
                type="text"
                aria-invalid={fieldState.invalid}
                {...field}
            />
            <p>{fieldState.error?.message}</p>
        </>
    );
};

const OrgSelect = props => {
    const { field, fieldState } = useInput(props);
    return (
        <>
            <select
                aria-label="organization"
                aria-invalid={fieldState.invalid}
                {...field}
            >
                <option value="">Select an organization</option>
                <option value="1">BigCorp</option>
                <option value="2">EvilCorp</option>
            </select>
            <p>{fieldState.error?.message}</p>
        </>
    );
};

const defaultDataProvider = fakerestDataProvider(
    {
        users: [
            { id: 1, name: 'John Doe', organization_id: 1 },
            { id: 2, name: 'Jane Doe', organization_id: 2 },
        ],
        organizations: [
            { id: 1, name: 'BigCorp' },
            { id: 2, name: 'EvilCorp' },
        ],
    },
    process.env.NODE_ENV !== 'test'
);

const i18nProvider = polyglotI18nProvider(() =>
    mergeTranslations(englishMessages, {
        myapp: {
            validation: {
                unique: 'Value %{value} is already in use for %{field}',
            },
        },
    })
);

const Wrapper = ({ children, dataProvider = defaultDataProvider }) => {
    return (
        <CoreAdminContext
            dataProvider={dataProvider}
            queryClient={new QueryClient()}
            i18nProvider={i18nProvider}
        >
            <CreateBase resource="users">{children}</CreateBase>
        </CoreAdminContext>
    );
};

const BasicForm = () => {
    const unique = useUnique();
    return (
        <Form defaultValues={{ name: 'John Doe' }}>
            <p>
                The name field should be unique. Try to enter "John Doe" or
                "Jane Doe".
            </p>
            <Input source="name" defaultValue="" validate={unique()} />
            <button type="submit">Submit</button>
        </Form>
    );
};

export const Basic = ({ dataProvider }: { dataProvider?: DataProvider }) => {
    return (
        <Wrapper dataProvider={dataProvider}>
            <BasicForm />
        </Wrapper>
    );
};

const DeepFieldForm = () => {
    const unique = useUnique();
    return (
        <Form defaultValues={{ identity: { name: 'John Doe' } }}>
            <p>
                The name field should be unique. Try to enter "John Doe" or
                "Jane Doe".
            </p>
            <Input source="identity.name" defaultValue="" validate={unique()} />
            <button type="submit">Submit</button>
        </Form>
    );
};

export const DeepField = ({
    dataProvider = fakerestDataProvider(
        {
            users: [
                { id: 1, identity: { name: 'John Doe' }, organization_id: 1 },
                { id: 2, identity: { name: 'Jane Doe' }, organization_id: 2 },
            ],
            organizations: [
                { id: 1, name: 'BigCorp' },
                { id: 2, name: 'EvilCorp' },
            ],
        },
        process.env.NODE_ENV !== 'test'
    ),
}) => {
    return (
        <Wrapper dataProvider={dataProvider}>
            <DeepFieldForm />
        </Wrapper>
    );
};

const WithMessageForm = () => {
    const unique = useUnique();
    return (
        <Form defaultValues={{ name: 'John Doe' }}>
            <p>
                The name field should be unique. Try to enter "John Doe" or
                "Jane Doe".
            </p>

            <Input
                source="name"
                defaultValue=""
                validate={unique({
                    message: 'Someone is already registered with this name',
                })}
            />

            <button type="submit">Submit</button>
        </Form>
    );
};

export const WithMessage = ({
    dataProvider,
}: {
    dataProvider?: DataProvider;
}) => {
    return (
        <Wrapper dataProvider={dataProvider}>
            <WithMessageForm />
        </Wrapper>
    );
};

const WithTranslatedMessageForm = () => {
    const unique = useUnique();
    return (
        <Form defaultValues={{ name: 'John Doe' }}>
            <p>
                The name field should be unique. Try to enter "John Doe" or
                "Jane Doe".
            </p>
            <p>
                Show that the value and the field label are passed to the
                translation provider to build the validation message
            </p>

            <Input
                source="name"
                defaultValue=""
                label="Full Name"
                validate={unique({
                    message: 'myapp.validation.unique',
                })}
            />

            <button type="submit">Submit</button>
        </Form>
    );
};

export const WithTranslatedMessage = () => {
    return (
        <Wrapper>
            <WithTranslatedMessageForm />
        </Wrapper>
    );
};

const WithAdditionalFiltersForm = () => {
    const unique = useUnique();
    return (
        <Form defaultValues={{ name: 'John Doe', organization_id: 1 }}>
            <p>
                The name field should be unique. "John Doe" is already
                registered for BigCorp and "Jane Doe" is already registered for
                EvilCorp.
            </p>
            <OrgSelect source="organization_id" defaultValue="" />
            <FormDataConsumer>
                {({ formData }) => (
                    <Input
                        source="name"
                        defaultValue=""
                        validate={unique({
                            filter: {
                                organization_id: formData.organization_id,
                            },
                        })}
                    />
                )}
            </FormDataConsumer>
            <button type="submit">Submit</button>
        </Form>
    );
};

export const WithAdditionalFilters = ({
    dataProvider,
}: {
    dataProvider?: DataProvider;
}) => {
    return (
        <Wrapper dataProvider={dataProvider}>
            <WithAdditionalFiltersForm />
        </Wrapper>
    );
};

export const DataProviderErrorOnValidation = () => {
    let fail = true;
    const errorDataProvider = {
        ...defaultDataProvider,
        getList: (resource, params) => {
            if (fail) {
                fail = false;
                return Promise.reject(new Error('API is down'));
            }
            fail = true;
            return defaultDataProvider.getList(resource, params);
        },
    };

    return (
        <Wrapper dataProvider={errorDataProvider}>
            <p>The validation will fail one time over two</p>
            <BasicForm />
        </Wrapper>
    );
};
