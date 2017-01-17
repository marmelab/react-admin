import React from 'react';
import {
    AutocompleteInput,
    Create,
    Datagrid,
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
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'admin-on-rest/mui';
import PersonIcon from 'material-ui/svg-icons/social/person';
import Avatar from 'material-ui/Avatar';
import {
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CardText,
    CardTitle,
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import LocalizedComponent from 'admin-on-rest/i18n/LocalizedComponent';
export CommentIcon from 'material-ui/svg-icons/communication/chat-bubble';

const CommentFilter = LocalizedComponent(({ translate, ...props }) => (
    <Filter {...props}>
        <ReferenceInput label={translate('post.name')} source="post_id" reference="posts">
            <SelectInput optionText="title" />
        </ReferenceInput>
    </Filter>
));

const CommentPagination = LocalizedComponent(({ page, perPage, total, setPage, translate }) => {
    const nbPages = Math.ceil(total / perPage) || 1;
    return (
        nbPages > 1 &&
            <Toolbar>
                <ToolbarGroup>
                {page > 1 &&
                    <FlatButton primary key="prev" label={translate('aor.message.prev')} icon={<ChevronLeft />} onClick={() => setPage(page - 1)} />
                }
                {page !== nbPages &&
                    <FlatButton primary key="next" label={translate('aor.message.next')} icon={<ChevronRight />} onClick={() => setPage(page + 1)} labelPosition="before" />
                }
                </ToolbarGroup>
            </Toolbar>
    );
});

const cardStyle = {
    width: 300,
    minHeight: 300,
    margin: '0.5em',
    display: 'inline-block',
    verticalAlign: 'top',
};

const CommentGrid = LocalizedComponent(({ ids, data, basePath, translate }) => (
    <div style={{ margin: '1em' }}>
    {ids.map(id =>
        <Card key={id} style={cardStyle}>
            <CardHeader
                title={<TextField record={data[id]} source="author.name" label={translate('author.list.name')} />}
                subtitle={<DateField record={data[id]} source="created_at" label={translate('comment.form.created_at')} />}
                avatar={<Avatar icon={<PersonIcon />} />}
            />
            <CardText>
                <TextField record={data[id]} source="body" label={translate('comment.form.body')} />
            </CardText>
            <CardText>
                about&nbsp;
                <ReferenceField label={translate('post.name')} resource="comments" record={data[id]} source="post_id" reference="posts" basePath={basePath}>
                    <TextField source="title" label={translate('post.list.title')} />
                </ReferenceField>
            </CardText>
            <CardActions style={{ textAlign: 'right' }}>
                <EditButton resource="posts" basePath={basePath} record={data[id]} />
            </CardActions>
        </Card>,
    )}
    </div>
));

CommentGrid.defaultProps = {
    data: {},
    ids: [],
};

export const CommentList = LocalizedComponent(({ translate, ...props }) => (
    <List title={translate('comment.all')} {...props} perPage={6} filters={<CommentFilter />} pagination={<CommentPagination />}>
        <CommentGrid />
    </List>
));

export const CommentEdit = LocalizedComponent(({ translate, ...props }) => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <ReferenceInput label={translate('post.name')} source="post_id" reference="posts" perPage={5} sort={{ field: 'title', order: 'ASC' }}>
                <AutocompleteInput optionText="title" />
            </ReferenceInput>
            <TextInput label={translate('comment.form.author_name')} source="author.name" validation={{ minLength: 10 }} />
            <DateInput label={translate('comment.form.created_at')} source="created_at" />
            <LongTextInput source="body" label={translate('comment.form.body')} validation={{ minLength: 10 }} />
        </SimpleForm>
    </Edit>
));

export const CommentCreate = LocalizedComponent(({ translate, ...props }) => (
    <Create {...props} defaultValues={{ created_at: new Date() }}>
        <SimpleForm>
            <ReferenceInput label={translate('post.name')} source="post_id" reference="posts" allowEmpty>
                <SelectInput optionText="title" />
            </ReferenceInput>
            <DateInput label={translate('comment.form.created_at')} source="created_at" />
            <LongTextInput source="body" label={translate('comment.form.body')} />
        </SimpleForm>
    </Create>
));
