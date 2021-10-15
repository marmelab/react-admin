import * as React from 'react';
import { styled, useTheme, useMediaQuery } from '@mui/material';
import MuiGridList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import {
    linkToRecord,
    NumberField,
    useListContext,
    DatagridProps,
    Identifier,
} from 'react-admin';
import { Link } from 'react-router-dom';

const PREFIX = 'GridList';

const classes = {
    gridList: `${PREFIX}-gridList`,
    tileBar: `${PREFIX}-tileBar`,
    placeholder: `${PREFIX}-placeholder`,
    price: `${PREFIX}-price`,
    link: `${PREFIX}-link`,
};

const StyledGridList = styled(MuiGridList)(({ theme }) => ({
    [`& .${classes.gridList}`]: {
        margin: 0,
    },

    [`& .${classes.tileBar}`]: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)',
    },

    [`& .${classes.placeholder}`]: {
        backgroundColor: theme.palette.grey[300],
        height: '100%',
    },

    [`& .${classes.price}`]: {
        display: 'inline',
        fontSize: '1em',
    },

    [`& .${classes.link}`]: {
        color: '#fff',
    },
}));

const useColsForWidth = () => {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.up('xs'));
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));

    if (xs) return 2;
    if (sm) return 3;
    if (md) return 3;
    if (lg) return 5;

    return 6;
};

const times = (nbChildren: number, fn: (key: number) => any) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

const LoadingGridList = (props: DatagridProps & { nbItems?: number }) => {
    const { nbItems = 20 } = props;
    const cols = useColsForWidth();
    return (
        <StyledGridList
            rowHeight={180}
            cols={cols}
            className={classes.gridList}
        >
            {' '}
            {times(nbItems, key => (
                <ImageListItem key={key}>
                    <div className={classes.placeholder} />
                </ImageListItem>
            ))}
        </StyledGridList>
    );
};

const LoadedGridList = (props: DatagridProps) => {
    const { ids, data, basePath } = useListContext();
    const cols = useColsForWidth();

    if (!ids || !data) return null;

    return (
        <StyledGridList
            rowHeight={180}
            cols={cols}
            className={classes.gridList}
        >
            {ids.map((id: Identifier) => (
                <ImageListItem
                    // @ts-ignore
                    component={Link}
                    key={id}
                    to={linkToRecord(basePath, data[id].id)}
                >
                    <img src={data[id].thumbnail} alt="" />
                    <ImageListItemBar
                        className={classes.tileBar}
                        title={data[id].reference}
                        subtitle={
                            <span>
                                {data[id].width}x{data[id].height},{' '}
                                <NumberField
                                    className={classes.price}
                                    source="price"
                                    record={data[id]}
                                    color="inherit"
                                    options={{
                                        style: 'currency',
                                        currency: 'USD',
                                    }}
                                />
                            </span>
                        }
                    />
                </ImageListItem>
            ))}
        </StyledGridList>
    );
};

const ImageList = () => {
    const { loaded } = useListContext();
    return loaded ? <LoadedGridList /> : <LoadingGridList />;
};

export default ImageList;
