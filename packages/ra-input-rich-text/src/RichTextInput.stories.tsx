import * as React from 'react';
import {
    I18nProvider,
    required,
    useGetManyReference,
    useRecordContext,
} from 'ra-core';
import {
    AdminContext,
    Edit,
    PrevNextButtons,
    SimpleForm,
    SimpleFormProps,
    TopToolbar,
} from 'ra-ui-materialui';
import { useWatch } from 'react-hook-form';
import fakeRestDataProvider from 'ra-data-fakerest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Mention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import {
    DefaultEditorOptions,
    RichTextInput,
    RichTextInputProps,
} from './RichTextInput';
import { RichTextInputToolbar } from './RichTextInputToolbar';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
} from '@mui/material';

export default { title: 'ra-input-rich-text/RichTextInput' };

const FormInspector = ({ name = 'body' }) => {
    const value = useWatch({ name });
    return (
        <div style={{ backgroundColor: 'lightgrey' }}>
            {name} value in form:&nbsp;
            <code>
                {JSON.stringify(value)} ({typeof value})
            </code>
        </div>
    );
};

const i18nProvider: I18nProvider = {
    translate: (key: string, options: any) => options?._ ?? key,
    changeLocale: () => Promise.resolve(),
    getLocale: () => 'en',
};

export const Basic = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            {...props}
        >
            <RichTextInput source="body" />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

export const Disabled = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            {...props}
        >
            <RichTextInput source="body" disabled />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

export const Small = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
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
    </AdminContext>
);

export const Medium = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
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
    </AdminContext>
);

export const Large = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
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
    </AdminContext>
);

export const FullWidth = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            {...props}
        >
            <RichTextInput
                toolbar={<RichTextInputToolbar />}
                label="Body"
                source="body"
                fullWidth
            />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

export const Sx = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
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
    </AdminContext>
);

export const Validation = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm onSubmit={() => {}} {...props}>
            <RichTextInput label="Body" source="body" validate={required()} />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

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
    <MemoryRouter initialEntries={['/posts/1']}>
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
    </MemoryRouter>
);

const MentionList = React.forwardRef<
    MentionListRef,
    {
        items: string[];
        command: (props: { id: string }) => void;
    }
>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const selectItem = index => {
        const item = props.items[index];

        if (item) {
            props.command({ id: item });
        }
    };

    const upHandler = () => {
        setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length
        );
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    React.useEffect(() => setSelectedIndex(0), [props.items]);

    React.useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    return (
        <Paper>
            <List dense disablePadding>
                {props.items.length ? (
                    props.items.map((item, index) => (
                        <ListItemButton
                            dense
                            selected={index === selectedIndex}
                            key={index}
                            onClick={() => selectItem(index)}
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
});

type MentionListRef = {
    onKeyDown: (props: { event: React.KeyboardEvent }) => boolean;
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
            let component: ReactRenderer<MentionListRef>;
            let popup: TippyInstance[];

            return {
                onStart: props => {
                    component = new ReactRenderer(MentionList, {
                        props,
                        editor: props.editor,
                    });

                    if (!props.clientRect) {
                        return;
                    }

                    popup = tippy('body', {
                        getReferenceClientRect: props.clientRect,
                        appendTo: () => document.body,
                        content: component.element,
                        showOnCreate: true,
                        interactive: true,
                        trigger: 'manual',
                        placement: 'bottom-start',
                    });
                },

                onUpdate(props) {
                    if (component) {
                        component.updateProps(props);
                    }

                    if (!props.clientRect) {
                        return;
                    }

                    if (popup && popup[0]) {
                        popup[0].setProps({
                            getReferenceClientRect: props.clientRect,
                        });
                    }
                },

                onKeyDown(props) {
                    if (popup && popup[0] && props.event.key === 'Escape') {
                        popup[0].hide();

                        return true;
                    }

                    if (!component.ref) {
                        return false;
                    }

                    return component.ref.onKeyDown(props);
                },

                onExit() {
                    queueMicrotask(() => {
                        if (popup && popup[0] && !popup[0].state.isDestroyed) {
                            popup[0].destroy();
                        }
                        if (component) {
                            component.destroy();
                        }
                        // Remove references to the old popup and component upon destruction/exit.
                        // (This should prevent redundant calls to `popup.destroy()`, which Tippy
                        // warns in the console is a sign of a memory leak, as the `suggestion`
                        // plugin seems to call `onExit` both when a suggestion menu is closed after
                        // a user chooses an option, *and* when the editor itself is destroyed.)
                        popup = undefined;
                        component = undefined;
                    });
                },
            };
        },
    };
};
