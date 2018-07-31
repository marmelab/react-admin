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
import React from 'react';
import {
    DateField,
    EditButton,
    Filter,
    List,
    ReferenceField,
    ReferenceInput,
    Responsive,
    SelectInput,
    ShowButton,
    SimpleList,
    TextField,
    translate,
    crudGetMany,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const CommentFilter = props => (
    <Filter {...props}>
        <ReferenceInput source="post_id" reference="posts">
            <SelectInput optionText="title" />
        </ReferenceInput>
    </Filter>
);

const exporter = (records, convertToCSV, downloadCSV, dispatch) => {
    const recordsWithAuthor = records.map(record => {
        const { author, ...res } = record; // omit author
        res.author_name = author.name;
        return res;
    });
    const postIds = [...new Set(records.map(record => record.post_id))];
    dispatch(
        crudGetMany('posts', postIds, ({ payload: { data } }) => {
            const postsIndexedById = data.reduce((acc, post) => {
                acc[post.id] = post;
                return acc;
            }, {});
            const recordsWithAuthorAndPost = recordsWithAuthor.map(record => {
                record.post_title = postsIndexedById[record.post_id].title;
                return record;
            });
            downloadCSV(
                convertToCSV({
                    fields: [
                        'id',
                        'author_name',
                        'post_id',
                        'post_title',
                        'created_at',
                        'body',
                    ],
                    data: recordsWithAuthorAndPost,
                })
            );
        })
    );
};

const CommentPagination = translate(
    ({ page, perPage, total, setPage, translate }) => {
        const nbPages = Math.ceil(total / perPage) || 1;
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
        <Grid spacing={16} container style={{ padding: '1em' }}>
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
