import * as React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    useMediaQuery,
    Theme,
} from '@mui/material';
import jsonExport from 'jsonexport/dist';
import {
    ListBase,
    ListToolbar,
    ListActions,
    DateField,
    EditButton,
    Pagination,
    ReferenceField,
    ReferenceInput,
    SearchInput,
    ShowButton,
    SimpleList,
    TextField,
    Title,
    downloadCSV,
    useListContext,
    useTranslate,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const commentFilters = [
    <SearchInput source="q" alwaysOn />,
    <ReferenceInput source="post_id" reference="posts" />,
];

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

        return jsonExport(data, { headers }, (error, csv) => {
            if (error) {
                console.error(error);
            }
            downloadCSV(csv, 'comments');
        });
    });

const CommentGrid = () => {
    const { data } = useListContext();
    const translate = useTranslate();

    if (!data) return null;
    return (
        <Grid spacing={2} container>
            {data.map(record => (
                <Grid item key={record.id} sm={12} md={6} lg={4}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <CardHeader
                            className="comment"
                            title={
                                <TextField
                                    record={record}
                                    source="author.name"
                                />
                            }
                            subheader={
                                <DateField
                                    record={record}
                                    source="created_at"
                                />
                            }
                            avatar={
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            }
                        />
                        <CardContent>
                            <TextField
                                record={record}
                                source="body"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            />
                        </CardContent>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography
                                component="span"
                                variant="body2"
                                data-testid="postLink"
                            >
                                {translate('comment.list.about')}&nbsp;
                            </Typography>
                            <ReferenceField
                                record={record}
                                source="post_id"
                                reference="posts"
                            />
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <EditButton record={record} />
                            <ShowButton record={record} />
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

const CommentMobileList = () => (
    <SimpleList
        primaryText={record => record.author.name}
        secondaryText={record => record.body}
        tertiaryText={record =>
            new Date(record.created_at).toLocaleDateString()
        }
        leftAvatar={() => <PersonIcon />}
    />
);

const CommentList = () => (
    <ListBase perPage={6} exporter={exporter}>
        <ListView />
    </ListBase>
);

const ListView = () => {
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    const { defaultTitle } = useListContext();
    return (
        <>
            <Title defaultTitle={defaultTitle} />
            <ListToolbar filters={commentFilters} actions={<ListActions />} />
            {isSmall ? <CommentMobileList /> : <CommentGrid />}
            <Pagination rowsPerPageOptions={[6, 9, 12]} />
        </>
    );
};

export default CommentList;
