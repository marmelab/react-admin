import React from 'react';
import {
    AutocompleteInput,
    Create,
    DateField,
    DateInput,
    DisabledInput,
    Edit,
    EditButton,
    Filter,
    List,
    LongTextInput,
    ReferenceField,
    ReferenceInput,
    Responsive,
    SelectInput,
    SimpleList,
    SimpleForm,
    TextField,
    TextInput,
    minLength,
    translate,
    Show,
    ShowButton,
    SimpleShowLayout,
} from 'admin-on-rest'; // eslint-disable-line import/no-unresolved

import PersonIcon from 'material-ui/svg-icons/social/person';
import Avatar from 'material-ui/Avatar';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
export CommentIcon from 'material-ui/svg-icons/communication/chat-bubble';

const CommentFilter = ({ ...props }) => (
    <Filter {...props}>
        <ReferenceInput source="post_id" reference="posts">
            <SelectInput optionText="title" />
        </ReferenceInput>
    </Filter>
);

const CommentPagination = translate(
    ({ page, perPage, total, setPage, translate }) => {
        const nbPages = Math.ceil(total / perPage) || 1;
        return (
            nbPages > 1 && (
                <Toolbar>
                    <ToolbarGroup>
                        {page > 1 && (
                            <FlatButton
                                primary
                                key="prev"
                                label={translate('aor.navigation.prev')}
                                icon={<ChevronLeft />}
                                onClick={() => setPage(page - 1)}
                            />
                        )}
                        {page !== nbPages && (
                            <FlatButton
                                primary
                                key="next"
                                label={translate('aor.navigation.next')}
                                icon={<ChevronRight />}
                                onClick={() => setPage(page + 1)}
                                labelPosition="before"
                            />
                        )}
                    </ToolbarGroup>
                </Toolbar>
            )
        );
    }
);

const cardStyle = {
    width: 300,
    minHeight: 300,
    margin: '0.5em',
    display: 'inline-block',
    verticalAlign: 'top',
};

const CommentGrid = translate(({ ids, data, basePath, translate }) => (
    <div style={{ margin: '1em' }}>
        {ids.map(id => (
            <Card key={id} style={cardStyle}>
                <CardHeader
                    title={<TextField record={data[id]} source="author.name" />}
                    subtitle={
                        <DateField record={data[id]} source="created_at" />
                    }
                    avatar={<Avatar icon={<PersonIcon />} />}
                />
                <CardText>
                    <TextField record={data[id]} source="body" />
                </CardText>
                <CardText>
                    {translate('comment.list.about')}&nbsp;
                    <ReferenceField
                        resource="comments"
                        record={data[id]}
                        source="post_id"
                        reference="posts"
                        basePath={basePath}
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </CardText>
                <CardActions style={{ textAlign: 'right' }}>
                    <EditButton
                        resource="posts"
                        basePath={basePath}
                        record={data[id]}
                    />
                    <ShowButton
                        resource="posts"
                        basePath={basePath}
                        record={data[id]}
                    />
                </CardActions>
            </Card>
        ))}
    </div>
));

CommentGrid.defaultProps = {
    data: {},
    ids: [],
};

const CommentMobileList = props => (
    <SimpleList
        primaryText={record => record.author.name}
        secondaryText={record => record.body}
        secondaryTextLines={2}
        tertiaryText={record =>
            new Date(record.created_at).toLocaleDateString()}
        leftAvatar={() => <Avatar icon={<PersonIcon />} />}
        {...props}
    />
);

export const CommentList = ({ ...props }) => (
    <List
        {...props}
        perPage={6}
        filters={<CommentFilter />}
        pagination={<CommentPagination />}
    >
        <Responsive small={<CommentMobileList />} medium={<CommentGrid />} />
    </List>
);

export const CommentEdit = ({ ...props }) => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <ReferenceInput
                source="post_id"
                reference="posts"
                perPage={5}
                sort={{ field: 'title', order: 'ASC' }}
            >
                <AutocompleteInput optionText="title" />
            </ReferenceInput>
            <TextInput source="author.name" validate={minLength(10)} />
            <DateInput source="created_at" />
            <LongTextInput source="body" validate={minLength(10)} />
        </SimpleForm>
    </Edit>
);

export const CommentCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm defaultValue={{ created_at: new Date() }}>
            <ReferenceInput
                source="post_id"
                reference="posts"
                allowEmpty
                validation={{ required: true }}
            >
                <SelectInput optionText="title" />
            </ReferenceInput>
            <DateInput source="created_at" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Create>
);

export const CommentShow = ({ ...props }) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" addLabel />
            <ReferenceField source="post_id" reference="posts" addLabel>
                <TextField source="title" />
            </ReferenceField>
            <TextField source="author.name" addLabel />
            <DateField source="created_at" addLabel />
            <TextField source="body" addLabel />
        </SimpleShowLayout>
    </Show>
);
