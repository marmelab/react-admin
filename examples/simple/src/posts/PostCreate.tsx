import * as React from 'react';
import { useMemo } from 'react';
import RichTextInput from 'ra-input-rich-text';
import {
    ArrayInput,
    AutocompleteInput,
    BooleanInput,
    Create,
    DateInput,
    NumberInput,
    NumberInputProps,
    ReferenceInput,
    SaveButton,
    SimpleForm,
    SimpleFormIterator,
    TextInput,
    Toolbar,
    required,
    FileInput,
    FileField,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import { useWatch } from 'react-hook-form';
import format from 'date-fns/format';
import { RoleSelectInput } from './RoleSelectInput';

const PostCreateToolbar = props => (
    <Toolbar {...props}>
        <SaveButton
            label="post.action.save_and_edit"
            redirect="edit"
            submitOnEnter={true}
        />
        <SaveButton
            label="post.action.save_and_show"
            redirect="show"
            submitOnEnter={false}
            variant="text"
        />
        <SaveButton
            label="post.action.save_and_add"
            redirect={false}
            submitOnEnter={false}
            variant="text"
        />
        <SaveButton
            label="post.action.save_with_average_note"
            transform={data => ({ ...data, average_note: 10 })}
            redirect="show"
            submitOnEnter={false}
            variant="text"
        />
    </Toolbar>
);

// FIXME? ArrayInput default value doesn't work anymore
const backlinksDefaultValue = [
    {
        date: format(new Date(), 'YYYY-MM-DD'),
        url: 'http://google.com',
    },
];
const PostCreate = ({ permissions, ...props }) => {
    const dateDefaultValue = useMemo(() => new Date(), []);
    const defaultValues = useMemo(
        () => ({
            average_note: 0,
        }),
        []
    );

    return (
        <Create {...props}>
            <SimpleForm
                toolbar={<PostCreateToolbar />}
                defaultValues={defaultValues}
                // FIXME
                // validate={values => {
                //     const errors = {} as any;
                //     ['title', 'teaser'].forEach(field => {
                //         if (!values[field]) {
                //             errors[field] = 'Required field';
                //         }
                //     });

                //     if (values.average_note < 0 || values.average_note > 5) {
                //         errors.average_note = 'Should be between 0 and 5';
                //     }

                //     return errors;
                // }}
            >
                <FileInput
                    source="pdffile"
                    label="PDF-Template"
                    accept="application/pdf"
                >
                    <FileField source="src" title="title" />
                </FileInput>
                <TextInput autoFocus source="title" />
                <TextInput source="teaser" fullWidth={true} multiline={true} />
                <RichTextInput source="body" validate={required()} />
                <AverageNoteInput source="average_note" />

                <DateInput
                    source="published_at"
                    defaultValue={dateDefaultValue}
                />
                <BooleanInput source="commentable" defaultValue />
                <ArrayInput source="backlinks" validate={[required()]}>
                    <SimpleFormIterator>
                        <DateInput source="date" />
                        <TextInput source="url" />
                    </SimpleFormIterator>
                </ArrayInput>
                {permissions === 'admin' && (
                    <ArrayInput source="authors">
                        <SimpleFormIterator>
                            <ReferenceInput
                                label="User"
                                source="user_id"
                                reference="users"
                            >
                                <AutocompleteInput />
                            </ReferenceInput>
                            <RoleSelectInput source="role" />
                        </SimpleFormIterator>
                    </ArrayInput>
                )}
            </SimpleForm>
        </Create>
    );
};

const AverageNoteInput = (props: NumberInputProps) => {
    const title = useWatch({ name: 'title' });

    return title ? (
        <NumberInput key={title} defaultValue={0} {...props} />
    ) : null;
};

export default PostCreate;
