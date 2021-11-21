import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import {
    linkToRecord,
    ReferenceField,
    FunctionField,
    TextField,
    useListContext,
    Record,
} from 'react-admin';

import AvatarField from '../visitors/AvatarField';
import { Review, Customer } from './../types';

const PREFIX = 'ReviewListMobile';

const classes = {
    root: `${PREFIX}-root`,
    link: `${PREFIX}-link`,
    inline: `${PREFIX}-inline`,
};

const StyledList = styled(List)({
    [`&.${classes.root}`]: {
        width: '100vw',
    },
    [`& .${classes.link}`]: {
        textDecoration: 'none',
        color: 'inherit',
    },
    [`& .${classes.inline}`]: {
        display: 'inline',
    },
});

const ReviewListMobile = () => {
    const { data, ids, loaded, total } = useListContext<Review>();

    return loaded || Number(total) > 0 ? (
        <StyledList className={classes.root}>
            {(ids as Exclude<typeof ids, undefined>).map(id => {
                const item = (data as Exclude<typeof data, undefined>)[id];
                if (!item) return null;

                return (
                    <Link
                        to={linkToRecord('/reviews', id)}
                        className={classes.link}
                        key={id}
                    >
                        <ListItem button>
                            <ListItemAvatar>
                                <ReferenceField
                                    record={item}
                                    source="customer_id"
                                    reference="customers"
                                    basePath="/customers"
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
                                            basePath="/customers"
                                            link={false}
                                        >
                                            <FunctionField
                                                render={(record?: Record) =>
                                                    record
                                                        ? `${
                                                              (record as Customer)
                                                                  .first_name
                                                          } ${
                                                              (record as Customer)
                                                                  .last_name
                                                          }`
                                                        : ''
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
                                            basePath="/products"
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
        </StyledList>
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
