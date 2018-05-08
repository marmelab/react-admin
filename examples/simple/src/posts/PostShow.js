import { ShowController } from 'ra-core';
import React from 'react';
import {
    ArrayField,
    BooleanField,
    ChipField,
    Datagrid,
    DateField,
    EditButton,
    NumberField,
    ReferenceArrayField,
    ReferenceManyField,
    RichTextField,
    SelectField,
    ShowView,
    SingleFieldList,
    Tab,
    TabbedShowLayout,
    TextField,
    UrlField,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import PostTitle from './PostTitle';

const PostShow = props => (
    <ShowController title={<PostTitle />} {...props}>
        {controllerProps => (
            <ShowView {...props} {...controllerProps}>
                <TabbedShowLayout>
                    <Tab label="post.form.summary">
                        <TextField source="id" />
                        <TextField source="title" />
                        {controllerProps.record &&
                            controllerProps.record.title ==
                                'Fusce massa lorem, pulvinar a posuere ut, accumsan ac nisi' && (
                                <TextField source="teaser" />
                            )}
                        <ArrayField source="backlinks">
                            <Datagrid>
                                <DateField source="date" />
                                <UrlField source="url" />
                            </Datagrid>
                        </ArrayField>
                    </Tab>
                    <Tab label="post.form.body">
                        <RichTextField
                            source="body"
                            stripTags={false}
                            label=""
                            addLabel={false}
                        />
                    </Tab>
                    <Tab label="post.form.miscellaneous">
                        <ReferenceArrayField reference="tags" source="tags">
                            <SingleFieldList>
                                <ChipField source="name" />
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
                    </Tab>
                    <Tab label="post.form.comments">
                        <ReferenceManyField
                            addLabel={false}
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
                    </Tab>
                </TabbedShowLayout>
            </ShowView>
        )}
    </ShowController>
);

export default PostShow;
