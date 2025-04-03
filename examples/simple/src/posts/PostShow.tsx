import * as React from 'react';
import {
    ArrayField,
    BooleanField,
    CloneButton,
    ChipField,
    DataTable,
    DateField,
    EditButton,
    NumberField,
    ReferenceArrayField,
    ReferenceManyField,
    ReferenceManyCount,
    RichTextField,
    SelectField,
    ShowContextProvider,
    ShowView,
    SingleFieldList,
    TabbedShowLayout,
    TextField,
    UrlField,
    useShowController,
    useLocaleState,
    useRecordContext,
} from 'react-admin';
import PostTitle from './PostTitle';

const CreateRelatedComment = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <CloneButton
            resource="comments"
            label="Add comment"
            record={{ post_id: record.id }}
        />
    );
};

const PostShow = () => {
    const controllerProps = useShowController();
    const [locale] = useLocaleState();
    return (
        <ShowContextProvider value={controllerProps}>
            <ShowView title={<PostTitle />}>
                <TabbedShowLayout>
                    <TabbedShowLayout.Tab label="post.form.summary">
                        <TextField source="id" />
                        <TextField source="title" />
                        {controllerProps.record &&
                            controllerProps.record.title ===
                                'Fusce massa lorem, pulvinar a posuere ut, accumsan ac nisi' && (
                                <TextField source="teaser" />
                            )}
                        <ArrayField source="backlinks">
                            <DataTable bulkActionButtons={false}>
                                <DataTable.Col
                                    field={DateField}
                                    source="date"
                                />
                                <DataTable.Col field={UrlField} source="url" />
                            </DataTable>
                        </ArrayField>
                    </TabbedShowLayout.Tab>
                    <TabbedShowLayout.Tab label="post.form.body">
                        <RichTextField
                            source="body"
                            stripTags={false}
                            label={false}
                        />
                    </TabbedShowLayout.Tab>
                    <TabbedShowLayout.Tab label="post.form.miscellaneous">
                        <ReferenceArrayField
                            reference="tags"
                            source="tags"
                            sort={{ field: `name.${locale}`, order: 'ASC' }}
                        >
                            <SingleFieldList>
                                <ChipField
                                    source={`name.${locale}`}
                                    size="small"
                                    clickable
                                />
                            </SingleFieldList>
                        </ReferenceArrayField>
                        <DateField source="published_at" />
                        <SelectField
                            source="category"
                            choices={[
                                { name: 'Tech', id: 'tech' },
                                { name: 'Lifestyle', id: 'lifestyle' },
                            ]}
                        />
                        <NumberField source="average_note" />
                        <BooleanField source="commentable" />
                        <TextField source="views" />
                        <CloneButton />
                    </TabbedShowLayout.Tab>
                    <TabbedShowLayout.Tab
                        label="post.form.comments"
                        count={
                            <ReferenceManyCount
                                reference="comments"
                                target="post_id"
                                sx={{ lineHeight: 'inherit' }}
                            />
                        }
                    >
                        <ReferenceManyField
                            reference="comments"
                            target="post_id"
                            sort={{ field: 'created_at', order: 'DESC' }}
                        >
                            <DataTable>
                                <DataTable.Col
                                    source="created_at"
                                    field={DateField}
                                />
                                <DataTable.Col source="author.name" />
                                <DataTable.Col source="body" />
                                <DataTable.Col>
                                    <EditButton />
                                </DataTable.Col>
                            </DataTable>
                        </ReferenceManyField>
                        <CreateRelatedComment />
                    </TabbedShowLayout.Tab>
                </TabbedShowLayout>
            </ShowView>
        </ShowContextProvider>
    );
};

export default PostShow;
