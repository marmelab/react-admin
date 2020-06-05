import * as React from 'react';
import { Fragment, FC } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
    linkToRecord,
    ReferenceField,
    FunctionField,
    TextField,
} from 'react-admin';

import AvatarField from '../visitors/AvatarField';
import { DatagridProps } from '../types';
import { Review, Customer } from './../types';

const useStyles = makeStyles({
    root: {
        width: '100vw',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    inline: {
        display: 'inline',
    },
});

const ReviewListMobile: FC<DatagridProps<Review>> = ({
    basePath,
    data,
    ids,
    loaded,
    total,
}) => {
    const classes = useStyles();

    return loaded || Number(total) > 0 ? (
        <List className={classes.root}>
            {(ids as Exclude<typeof ids, undefined>).map(id => {
                const item = (data as Exclude<typeof data, undefined>)[id];
                if (!item) return null;

                return (
                    <Link
                        to={linkToRecord(basePath, id)}
                        className={classes.link}
                        key={id}
                    >
                        <ListItem button>
                            <ListItemAvatar>
                                <ReferenceField
                                    record={item}
                                    source="customer_id"
                                    reference="customers"
                                    basePath={basePath}
                                    link={false}
                                >
                                    <AvatarField size="40" />
                                </ReferenceField>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Fragment>
                                        <ReferenceField
                                            record={item}
                                            source="customer_id"
                                            reference="customers"
                                            basePath={basePath}
                                            link={false}
                                        >
                                            <FunctionField
                                                render={(record: Customer) =>
                                                    `${record.first_name} ${
                                                        record.last_name
                                                    }`
                                                }
                                                variant="subtitle1"
                                                className={classes.inline}
                                            />
                                        </ReferenceField>{' '}
                                        on{' '}
                                        <ReferenceField
                                            record={item}
                                            source="product_id"
                                            reference="products"
                                            basePath={basePath}
                                            link={false}
                                        >
                                            <TextField
                                                source="reference"
                                                variant="subtitle1"
                                                className={classes.inline}
                                            />
                                        </ReferenceField>
                                    </Fragment>
                                }
                                secondary={item.comment}
                                secondaryTypographyProps={{ noWrap: true }}
                            />
                        </ListItem>
                    </Link>
                );
            })}
        </List>
    ) : null;
};

ReviewListMobile.propTypes = {
    basePath: PropTypes.string,
    data: PropTypes.any,
    hasBulkActions: PropTypes.bool.isRequired,
    ids: PropTypes.array,
    onToggleItem: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

ReviewListMobile.defaultProps = {
    hasBulkActions: false,
    selectedIds: [],
};

export default ReviewListMobile;
