import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { CoreAdmin } from '../../core/CoreAdmin';
import { Resource } from '../../core/Resource';
import { CreateBase } from '../../controller/create/CreateBase';
import { testDataProvider } from '../../dataProvider/testDataProvider';
import { DataProvider } from '../../types';
import { Form } from '../../form/Form';
import { InputProps, useInput } from '../../form/useInput';
import { TestMemoryRouter } from '../../routing/TestMemoryRouter';
import {
    ReferenceArrayInputBase,
    ReferenceArrayInputBaseProps,
} from './ReferenceArrayInputBase';
import {
    ChoicesContextValue,
    ChoicesProps,
    useChoicesContext,
} from '../../form';
import { useGetRecordRepresentation, useIsOffline } from '../..';
import { onlineManager } from '@tanstack/react-query';

export default { title: 'ra-core/controller/input/ReferenceArrayInputBase' };

const tags = [
    { id: 0, name: '3D' },
    { id: 1, name: 'Architecture' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Painting' },
    { id: 4, name: 'Photography' },
];

const defaultDataProvider = testDataProvider({
    getList: () =>
        // @ts-ignore
        Promise.resolve({
            data: tags,
            total: tags.length,
        }),
    // @ts-ignore
    getMany: (resource, params) => {
        if (process.env.NODE_ENV !== 'test') {
            console.log('getMany', resource, params);
        }
        return Promise.resolve({
            data: params.ids.map(id => tags.find(tag => tag.id === id)),
        });
    },
});

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const CheckboxGroupInput = (
    props: Omit<InputProps, 'source'> & ChoicesProps
) => {
    const choicesContext = useChoicesContext(props);

    return <CheckboxGroupInputBase {...props} {...choicesContext} />;
};

const CheckboxGroupInputBase = (
    props: Omit<InputProps, 'source'> & ChoicesProps & ChoicesContextValue
) => {
    const { allChoices, isPending, error, resource, source, total } = props;
    const input = useInput({ ...props, source });
    const getRecordRepresentation = useGetRecordRepresentation(resource);

    if (isPending) {
        return <span>Loading...</span>;
    }

    if (error) {
        return <span>Error: {error.message}</span>;
    }

    return (
        <div>
            {allChoices.map(choice => (
                <label key={choice.id}>
                    <input
                        type="checkbox"
                        // eslint-disable-next-line eqeqeq
                        checked={input.field.value.some(id => id == choice.id)}
                        onChange={() => {
                            const newValue = input.field.value.some(
                                // eslint-disable-next-line eqeqeq
                                id => id == choice.id
                            )
                                ? input.field.value.filter(
                                      // eslint-disable-next-line eqeqeq
                                      id => id != choice.id
                                  )
                                : [...input.field.value, choice.id];
                            input.field.onChange(newValue);
                        }}
                    />
                    {getRecordRepresentation(choice)}
                </label>
            ))}
            <div>
                Selected {resource}: {input.field.value.join(', ')}
            </div>
            <div>
                Total {resource}: {total}
            </div>
        </div>
    );
};

export const Basic = ({
    dataProvider = defaultDataProvider,
    meta,
    ...props
}: Partial<ReferenceArrayInputBaseProps> & {
    dataProvider?: DataProvider;
    meta?: boolean;
}) => (
    <TestMemoryRouter initialEntries={['/posts/create']}>
        <CoreAdmin dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <Resource
                name="posts"
                create={
                    <CreateBase resource="posts" record={{ tags_ids: [1, 3] }}>
                        <h1>Create Post</h1>
                        <Form>
                            <ReferenceArrayInputBase
                                reference="tags"
                                resource="posts"
                                source="tags_ids"
                                queryOptions={
                                    meta ? { meta: { foo: 'bar' } } : {}
                                }
                                {...props}
                            >
                                <CheckboxGroupInput />
                            </ReferenceArrayInputBase>
                        </Form>
                    </CreateBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

Basic.args = {
    meta: false,
};

Basic.argTypes = {
    meta: { control: 'boolean' },
};

export const WithRender = ({
    dataProvider = defaultDataProvider,
    meta,
    ...props
}: Partial<ReferenceArrayInputBaseProps> & {
    dataProvider?: DataProvider;
    meta?: boolean;
}) => (
    <TestMemoryRouter initialEntries={['/posts/create']}>
        <CoreAdmin dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <Resource
                name="posts"
                create={
                    <CreateBase resource="posts" record={{ tags_ids: [1, 3] }}>
                        <h1>Create Post</h1>
                        <Form>
                            <ReferenceArrayInputBase
                                reference="tags"
                                resource="posts"
                                source="tags_ids"
                                queryOptions={
                                    meta ? { meta: { foo: 'bar' } } : {}
                                }
                                {...props}
                                render={context => (
                                    <CheckboxGroupInputBase
                                        {...context}
                                        source="tags_ids"
                                    />
                                )}
                            />
                        </Form>
                    </CreateBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

WithRender.args = {
    meta: false,
};

WithRender.argTypes = {
    meta: { control: 'boolean' },
};

export const WithError = () => (
    <TestMemoryRouter initialEntries={['/posts/create']}>
        <CoreAdmin
            dataProvider={
                {
                    getList: () => Promise.reject(new Error('fetch error')),
                    getMany: () =>
                        Promise.resolve({ data: [{ id: 5, name: 'test1' }] }),
                } as unknown as DataProvider
            }
            i18nProvider={i18nProvider}
        >
            <Resource
                name="posts"
                create={
                    <CreateBase resource="posts" record={{ tags_ids: [1, 3] }}>
                        <h1>Create Post</h1>
                        <Form
                            onSubmit={() => {}}
                            defaultValues={{ tag_ids: [1, 3] }}
                        >
                            <ReferenceArrayInputBase
                                reference="tags"
                                resource="posts"
                                source="tag_ids"
                            >
                                <CheckboxGroupInput />
                            </ReferenceArrayInputBase>
                        </Form>
                    </CreateBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const Offline = () => (
    <TestMemoryRouter initialEntries={['/posts/create']}>
        <CoreAdmin
            dataProvider={defaultDataProvider}
            i18nProvider={i18nProvider}
        >
            <Resource
                name="posts"
                create={
                    <CreateBase resource="posts" record={{ tags_ids: [1, 3] }}>
                        <h1>Create Post</h1>
                        <Form>
                            <div
                                style={{
                                    width: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                }}
                            >
                                <RenderChildOnDemand>
                                    <ReferenceArrayInputBase
                                        reference="tags"
                                        resource="posts"
                                        source="tags_ids"
                                        offline={
                                            <p>
                                                You are offline, cannot load
                                                data
                                            </p>
                                        }
                                    >
                                        <CheckboxGroupInput optionText="name" />
                                    </ReferenceArrayInputBase>
                                </RenderChildOnDemand>
                                <SimulateOfflineButton />
                            </div>
                        </Form>
                    </CreateBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

const SimulateOfflineButton = () => {
    const isOffline = useIsOffline();
    return (
        <button
            type="button"
            onClick={event => {
                event.preventDefault();
                onlineManager.setOnline(isOffline);
            }}
        >
            {isOffline ? 'Simulate online' : 'Simulate offline'}
        </button>
    );
};

const RenderChildOnDemand = ({ children }) => {
    const [showChild, setShowChild] = React.useState(false);
    return (
        <>
            <button
                onClick={event => {
                    event.preventDefault();
                    setShowChild(!showChild);
                }}
            >
                Toggle Child
            </button>
            {showChild && <div>{children}</div>}
        </>
    );
};
