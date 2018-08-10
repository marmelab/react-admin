import React from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import { unparse as convertToCSV } from 'papaparse/papaparse.min';
import {
    DateField,
    EditButton,
    Filter,
    List,
    PaginationLimit,
    ReferenceField,
    ReferenceInput,
    Responsive,
    SelectInput,
    ShowButton,
    SimpleList,
    TextField,
    downloadCSV,
    translate,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const CommentFilter = props => (
    <Filter {...props}>
        <ReferenceInput source="post_id" reference="posts">
            <SelectInput optionText="title" />
        </ReferenceInput>
    </Filter>
);

const exporter = (records, fetchRelatedRecords) =>
    fetchRelatedRecords(records, 'post_id', 'posts').then(posts => {
        const data = records.map(record => {
            const { author, ...recordForExport } = record; // omit author
            recordForExport.author_name = author.name;
            recordForExport.post_title = posts[record.post_id].title;
            return recordForExport;
        });
        const fields = [
            'id',
            'author_name',
            'post_id',
            'post_title',
            'created_at',
            'body',
        ];
        downloadCSV(convertToCSV({ data, fields }), 'comments');
    });

const CommentPagination = translate(
    ({ isLoading, ids, page, perPage, total, setPage, translate }) => {
        const nbPages = Math.ceil(total / perPage) || 1;
        if (!isLoading && (total === 0 || (ids && !ids.length))) {
            return <PaginationLimit total={total} page={page} ids={ids} />;
        }

        return (
            nbPages > 1 && (
                <Toolbar>
                    {page > 1 && (
                        <Button
                            color="primary"
                            key="prev"
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft />&nbsp;
                            {translate('ra.navigation.prev')}
                        </Button>
                    )}
                    {page !== nbPages && (
                        <Button
                            color="primary"
                            key="next"
                            onClick={() => setPage(page + 1)}
                        >
                            {translate('ra.navigation.next')}&nbsp;
                            <ChevronRight />
                        </Button>
                    )}
                </Toolbar>
            )
        );
    }
);

const listStyles = theme => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: theme.typography.body1,
    cardLink: {
        ...theme.typography.body1,
        flexGrow: 1,
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
});

const CommentGrid = withStyles(listStyles)(
    translate(({ classes, ids, data, basePath, translate }) => (
        <Grid spacing={16} container style={{ padding: '0 1em' }}>
            {ids.map(id => (
                <Grid item key={id} sm={12} md={6} lg={4}>
                    <Card className={classes.card}>
                        <CardHeader
                            className="comment"
                            title={
                                <TextField
                                    record={data[id]}
                                    source="author.name"
                                />
                            }
                            subheader={
                                <DateField
                                    record={data[id]}
                                    source="created_at"
                                />
                            }
                            avatar={
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            }
                        />
                        <CardContent className={classes.cardContent}>
                            <TextField record={data[id]} source="body" />
                        </CardContent>
                        <CardContent className={classes.cardLink}>
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
                        </CardContent>
                        <CardActions className={classes.cardActions}>
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
                </Grid>
            ))}
        </Grid>
    ))
);

CommentGrid.defaultProps = {
    data: {},
    ids: [],
};

const CommentMobileList = props => (
    <SimpleList
        primaryText={record => record.author.name}
        secondaryText={record => record.body}
        tertiaryText={record =>
            new Date(record.created_at).toLocaleDateString()
        }
        leftAvatar={() => <PersonIcon />}
        {...props}
    />
);

const CommentList = props => (
    <List
        {...props}
        perPage={6}
        exporter={exporter}
        filters={<CommentFilter />}
        pagination={<CommentPagination />}
    >
        <Responsive small={<CommentMobileList />} medium={<CommentGrid />} />
    </List>
);

export default CommentList;
