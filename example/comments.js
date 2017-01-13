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

export CommentIcon from 'material-ui/svg-icons/communication/chat-bubble';

const CommentFilter = (props) => (
    <Filter {...props}>
        <ReferenceInput label="Post" source="post_id" reference="posts">
            <SelectInput optionText="title" />
        </ReferenceInput>
    </Filter>
);

const CommentPagination = ({ page, perPage, total, setPage }) => {
    const nbPages = Math.ceil(total / perPage) || 1;
    return (
        nbPages > 1 &&
            <Toolbar>
                <ToolbarGroup>
                {page > 1 &&
                    <FlatButton primary key="prev" label="Prev" icon={<ChevronLeft />} onClick={() => setPage(page - 1)} />
                }
                {page !== nbPages &&
                    <FlatButton primary key="next" label="Next" icon={<ChevronRight />} onClick={() => setPage(page + 1)} labelPosition="before" />
                }
                </ToolbarGroup>
            </Toolbar>
    );
}

const cardStyle = {
    width: 300,
    minHeight: 300,
    margin: '0.5em',
    display: 'inline-block',
    verticalAlign: 'top'
};
const CommentGrid = ({ ids, data, basePath }) => (
    <div style={{ margin: '1em' }}>
    {ids.map(id =>
        <Card key={id} style={cardStyle}>
            <CardHeader
                title={<TextField record={data[id]} source="author.name" />}
                subtitle={<DateField record={data[id]} source="created_at" />}
                avatar={<Avatar icon={<PersonIcon />} />}
            />
            <CardText>
                <TextField record={data[id]} source="body" />
            </CardText>
            <CardText>
                about&nbsp;
                <ReferenceField label="Post" resource="comments" record={data[id]} source="post_id" reference="posts" basePath={basePath}>
                    <TextField source="title" />
                </ReferenceField>
            </CardText>
            <CardActions style={{ textAlign: 'right' }}>
                <EditButton resource="posts" basePath={basePath} record={data[id]} />
            </CardActions>
        </Card>
    )}
    </div>
);
CommentGrid.defaultProps = {
    data: {},
    ids: [],
};

export const CommentList = (props) => (
    <List title="All comments" {...props} perPage={6} filter={<CommentFilter />} pagination={<CommentPagination />}>
        <CommentGrid />
    </List>
);

export const CommentEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <ReferenceInput label="Post" source="post_id" reference="posts" perPage={5} sort={{ field: 'title', order: 'ASC' }}>
                <AutocompleteInput optionText="title" />
            </ReferenceInput>
            <TextInput label="Author name" source="author.name" />
            <DateInput label="date" source="created_at" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Edit>
);

export const CommentCreate = (props) => (
    <Create {...props} defaultValues={{ created_at: new Date() }}>
        <SimpleForm>
            <ReferenceInput label="Post" source="post_id" reference="posts" allowEmpty>
                <SelectInput optionText="title" />
            </ReferenceInput>
            <DateInput label="date" source="created_at" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Create>
);
