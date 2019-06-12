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
import { makeStyles } from '@material-ui/core/styles';
import jsonExport from 'jsonexport/dist';
import {
    DateField,
    EditButton,
    Filter,
    List,
    PaginationLimit,
    ReferenceField,
    ReferenceInput,
    SearchInput,
    SelectInput,
    ShowButton,
    SimpleList,
    TextField,
    downloadCSV,
    useTranslate,
    useMediaIsSmall,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const CommentFilter = props => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
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
        const headers = [
            'id',
            'author_name',
            'post_id',
            'post_title',
            'created_at',
            'body',
        ];

        jsonExport(data, { headers }, (error, csv) => {
            if (error) {
                console.error(error);
            }
            downloadCSV(csv, 'comments');
        });
    });

const CommentPagination = ({
    isLoading,
    ids,
    page,
    perPage,
    total,
    setPage,
}) => {
    const translate = useTranslate();
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
                        <ChevronLeft />
                        &nbsp;
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
};

const useListStyles = makeStyles(theme => ({
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
    cardLinkLink: {
        display: 'inline',
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
}));

const CommentGrid = ({ ids, data, basePath }) => {
    const translate = useTranslate();
    const classes = useListStyles();

    return (
        <Grid spacing={2} container>
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
                                <TextField
                                    source="title"
                                    className={classes.cardLinkLink}
                                />
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
    );
};

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

const CommentList = props => {
    const isSmall = useMediaIsSmall();

    return (
        <List
            {...props}
            perPage={6}
            exporter={exporter}
            filters={<CommentFilter />}
            pagination={<CommentPagination />}
            component="div"
        >
            {isSmall ? <CommentMobileList /> : <CommentGrid />}
        </List>
    );
};

export default CommentList;
