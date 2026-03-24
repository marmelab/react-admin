import * as React from 'react';
import {
    I18nProvider,
    required,
    useGetManyReference,
    useRecordContext,
    TestMemoryRouter,
    ResourceContextProvider,
} from 'ra-core';
import {
    AdminContext,
    Edit,
    PrevNextButtons,
    SimpleForm,
    SimpleFormProps,
    TopToolbar,
    Toolbar as RAToolbar,
    SaveButton,
} from 'ra-ui-materialui';
import { useWatch } from 'react-hook-form';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Routes, Route } from 'react-router-dom';
import Mention from '@tiptap/extension-mention';
import { Editor, ReactRenderer } from '@tiptap/react';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import {
    DefaultEditorOptions,
    RichTextInput,
    RichTextInputProps,
} from './RichTextInput';
import { RichTextInputToolbar } from './RichTextInputToolbar';
import {
    Box,
    Button,
    Card,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
} from '@mui/material';
import { FormatButtons } from './buttons';

export default { title: 'ra-input-rich-text/RichTextInput' };

const FormInspector = ({ name = 'body' }) => {
    const value = useWatch({ name });
    return (
        <Box sx={theme => ({ backgroundColor: theme.palette.divider })}>
            {name} value in form:&nbsp;
            <code>
                {JSON.stringify(value)} ({typeof value})
            </code>
        </Box>
    );
};

const i18nProvider: I18nProvider = {
    translate: (key: string, options: any) => options?._ ?? key,
    changeLocale: () => Promise.resolve(),
    getLocale: () => 'en',
};

export const Basic = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <Card>
                <SimpleForm
                    defaultValues={{ body: 'Hello World' }}
                    onSubmit={() => {}}
                    {...props}
                >
                    <RichTextInput source="body" />
                    <FormInspector />
                </SimpleForm>
            </Card>
        </ResourceContextProvider>
    </AdminContext>
);

export const Disabled = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <Card>
                <SimpleForm
                    defaultValues={{ body: 'Hello World' }}
                    onSubmit={() => {}}
                    {...props}
                >
                    <RichTextInput source="body" disabled />
                    <FormInspector />
                </SimpleForm>
            </Card>
        </ResourceContextProvider>
    </AdminContext>
);

export const ReadOnly = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <Card>
                <SimpleForm
                    defaultValues={{ body: 'Hello World' }}
                    onSubmit={() => {}}
                    {...props}
                >
                    <RichTextInput source="body" readOnly />
                    <FormInspector />
                </SimpleForm>
            </Card>
        </ResourceContextProvider>
    </AdminContext>
);

export const Small = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <Card>
                <SimpleForm
                    defaultValues={{ body: 'Hello World' }}
                    onSubmit={() => {}}
                    {...props}
                >
                    <RichTextInput
                        toolbar={<RichTextInputToolbar size="small" />}
                        label="Body"
                        source="body"
                    />
                    <FormInspector />
                </SimpleForm>
            </Card>
        </ResourceContextProvider>
    </AdminContext>
);

export const Medium = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <Card>
                <SimpleForm
                    defaultValues={{ body: 'Hello World' }}
                    onSubmit={() => {}}
                    {...props}
                >
                    <RichTextInput
                        toolbar={<RichTextInputToolbar size="medium" />}
                        label="Body"
                        source="body"
                    />
                    <FormInspector />
                </SimpleForm>
            </Card>
        </ResourceContextProvider>
    </AdminContext>
);

export const Large = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <Card>
                <SimpleForm
                    defaultValues={{ body: 'Hello World' }}
                    onSubmit={() => {}}
                    {...props}
                >
                    <RichTextInput
                        toolbar={<RichTextInputToolbar size="large" />}
                        label="Body"
                        source="body"
                    />
                    <FormInspector />
                </SimpleForm>
            </Card>
        </ResourceContextProvider>
    </AdminContext>
);

export const NotFullWidth = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <Card>
                <SimpleForm
                    defaultValues={{ body: 'Hello World' }}
                    onSubmit={() => {}}
                    {...props}
                >
                    <RichTextInput
                        toolbar={<RichTextInputToolbar />}
                        label="Body"
                        source="body"
                        fullWidth={false}
                    />
                    <FormInspector />
                </SimpleForm>
            </Card>
        </ResourceContextProvider>
    </AdminContext>
);

export const Sx = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <Card>
                <SimpleForm
                    defaultValues={{ body: 'Hello World' }}
                    onSubmit={() => {}}
                    {...props}
                >
                    <RichTextInput
                        label="Body"
                        source="body"
                        sx={{ border: '1px solid red' }}
                    />
                    <FormInspector />
                </SimpleForm>
            </Card>
        </ResourceContextProvider>
    </AdminContext>
);

export const Validation = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <Card>
                <SimpleForm onSubmit={() => {}} {...props}>
                    <RichTextInput
                        label="Body"
                        source="body"
                        validate={required()}
                    />
                    <FormInspector />
                </SimpleForm>
            </Card>
        </ResourceContextProvider>
    </AdminContext>
);

const MyRichTextInputToolbar = ({ ...props }) => {
    return (
        <RichTextInputToolbar {...props}>
            <FormatButtons />
        </RichTextInputToolbar>
    );
};

export const Toolbar = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <Card>
                <SimpleForm
                    defaultValues={{ body: 'Hello World' }}
                    onSubmit={() => {}}
                    {...props}
                >
                    <RichTextInput
                        source="body"
                        toolbar={<MyRichTextInputToolbar />}
                    />
                    <FormInspector />
                </SimpleForm>
            </Card>
        </ResourceContextProvider>
    </AdminContext>
);

export const EditorReference = (props: Partial<SimpleFormProps>) => {
    const editorRef = React.useRef<Editor>(null);

    const EditorToolbar = () => (
        <RAToolbar>
            <SaveButton />
            <Button
                onClick={() => {
                    editorRef.current.commands.setContent(
                        '<h3>Here is my template</h3>'
                    );
                }}
            >
                Use template
            </Button>
        </RAToolbar>
    );

    return (
        <AdminContext i18nProvider={i18nProvider}>
            <ResourceContextProvider value="posts">
                <Card>
                    <SimpleForm
                        defaultValues={{ body: 'Hello World' }}
                        toolbar={<EditorToolbar />}
                        onSubmit={() => {}}
                        {...props}
                    >
                        <RichTextInput
                            source="body"
                            editorOptions={{
                                ...DefaultEditorOptions,
                                onCreate: ({ editor }: { editor: Editor }) => {
                                    editorRef.current = editor;
                                },
                            }}
                        />
                        <FormInspector />
                    </SimpleForm>
                </Card>
            </ResourceContextProvider>
        </AdminContext>
    );
};

const dataProvider = fakeRestDataProvider({
    posts: [
        { id: 1, body: 'Post 1' },
        { id: 2, body: 'Post 2' },
        { id: 3, body: 'Post 3' },
    ],
    tags: [
        { id: 1, name: 'tag1', post_id: 1 },
        { id: 2, name: 'tag2', post_id: 1 },
        { id: 3, name: 'tag3', post_id: 2 },
        { id: 4, name: 'tag4', post_id: 2 },
        { id: 5, name: 'tag5', post_id: 3 },
        { id: 6, name: 'tag6', post_id: 3 },
    ],
});

const MyRichTextInput = (props: RichTextInputProps) => {
    const record = useRecordContext();
    const tags = useGetManyReference('tags', {
        target: 'post_id',
        id: record.id,
    });

    const editorOptions = React.useMemo(() => {
        return {
            ...DefaultEditorOptions,
            extensions: [
                ...DefaultEditorOptions.extensions,
                Mention.configure({
                    HTMLAttributes: {
                        class: 'mention',
                    },
                    suggestion: suggestions(tags.data?.map(t => t.name) ?? []),
                }),
            ],
        };
    }, [tags.data]);

    return <RichTextInput editorOptions={editorOptions} {...props} />;
};

export const CustomOptions = () => (
    <TestMemoryRouter initialEntries={['/posts/1']}>
        <AdminContext dataProvider={dataProvider}>
            <Routes>
                <Route
                    path="/posts/:id"
                    element={
                        <Edit
                            resource="posts"
                            actions={
                                <TopToolbar>
                                    <PrevNextButtons />
                                </TopToolbar>
                            }
                        >
                            <SimpleForm>
                                <MyRichTextInput source="body" />
                            </SimpleForm>
                        </Edit>
                    }
                />
            </Routes>
        </AdminContext>
    </TestMemoryRouter>
);

const MentionList = (props: {
    items: string[];
    command: (props: { id: string }) => void;
    onKeyDownRef: React.MutableRefObject<
        ((props: { event: KeyboardEvent }) => boolean) | null
    >;
}) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const selectItem = index => {
        const item = props.items[index];

        if (item) {
            props.command({ id: item });
        }
    };

    React.useEffect(() => setSelectedIndex(0), [props.items]);

    React.useEffect(() => {
        props.onKeyDownRef.current = ({ event }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex(
                    i => (i + props.items.length - 1) % props.items.length
                );
                return true;
            }

            if (event.key === 'ArrowDown') {
                setSelectedIndex(i => (i + 1) % props.items.length);
                return true;
            }

            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }

            return false;
        };
    });

    return (
        <Paper>
            <List dense disablePadding>
                {props.items.length ? (
                    props.items.map((item, index) => (
                        <ListItemButton
                            dense
                            selected={index === selectedIndex}
                            key={index}
                            onMouseDown={e => {
                                e.preventDefault();
                                selectItem(index);
                            }}
                        >
                            {item}
                        </ListItemButton>
                    ))
                ) : (
                    <ListItem className="item" dense>
                        <ListItemText>No result</ListItemText>
                    </ListItem>
                )}
            </List>
        </Paper>
    );
};
const suggestions = tags => {
    return {
        items: ({ query }) => {
            return tags
                .filter(item =>
                    item.toLowerCase().startsWith(query.toLowerCase())
                )
                .slice(0, 5);
        },

        render: () => {
            let component: ReactRenderer;
            let floatingEl: HTMLElement;
            const onKeyDownRef: React.MutableRefObject<
                ((props: { event: KeyboardEvent }) => boolean) | null
            > = { current: null };

            const updatePosition = (clientRect: () => DOMRect) => {
                if (!floatingEl) return;
                const virtualEl = {
                    getBoundingClientRect: clientRect,
                };
                computePosition(virtualEl, floatingEl, {
                    placement: 'bottom-start',
                    middleware: [offset(8), flip(), shift()],
                }).then(({ x, y }) => {
                    Object.assign(floatingEl.style, {
                        left: `${x}px`,
                        top: `${y}px`,
                    });
                });
            };

            return {
                onStart: props => {
                    component = new ReactRenderer(MentionList, {
                        props: { ...props, onKeyDownRef },
                        editor: props.editor,
                    });

                    floatingEl = document.createElement('div');
                    floatingEl.style.position = 'absolute';
                    floatingEl.style.zIndex = '1300';
                    floatingEl.addEventListener('mousedown', e =>
                        e.preventDefault()
                    );
                    floatingEl.appendChild(component.element);
                    props.editor.view.dom.parentElement.appendChild(floatingEl);

                    if (props.clientRect) {
                        updatePosition(props.clientRect);
                    }
                },

                onUpdate(props) {
                    if (component) {
                        component.updateProps({ ...props, onKeyDownRef });
                    }

                    if (props.clientRect) {
                        updatePosition(props.clientRect);
                    }
                },

                onKeyDown(props) {
                    if (props.event.key === 'Escape') {
                        if (floatingEl) {
                            floatingEl.style.display = 'none';
                        }
                        return true;
                    }

                    if (!onKeyDownRef.current) {
                        return false;
                    }

                    return onKeyDownRef.current(props);
                },

                onExit() {
                    onKeyDownRef.current = null;
                    queueMicrotask(() => {
                        if (component) {
                            component.destroy();
                        }
                        if (floatingEl && floatingEl.parentNode) {
                            floatingEl.parentNode.removeChild(floatingEl);
                        }
                        floatingEl = undefined;
                        component = undefined;
                    });
                },
            };
        },
    };
};
