import * as React from 'react';
import {
    ArrayField,
    BooleanField,
    CloneButton,
    ChipField,
    Datagrid,
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
                            <Datagrid bulkActionButtons={false}>
                                <DateField source="date" />
                                <UrlField source="url" />
                            </Datagrid>
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
                                <ChipField source={`name.${locale}`} />
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
                            <Datagrid>
                                <DateField source="created_at" />
                                <TextField source="author.name" />
                                <TextField source="body" />
                                <EditButton />
                            </Datagrid>
                        </ReferenceManyField>
                        <CreateRelatedComment />
                    </TabbedShowLayout.Tab>
                </TabbedShowLayout>
            </ShowView>
        </ShowContextProvider>
    );
};

export default PostShow;
