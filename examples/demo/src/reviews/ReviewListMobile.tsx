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
    const { data, isLoading, total } = useListContext<Review>();
    if (isLoading || Number(total) === 0) {
        return null;
    }
    return (
        <StyledList className={classes.root}>
            {data.map(item => {
                if (!item) return null;

                return (
                    <Link
                        to={linkToRecord('/reviews', item.id)}
                        className={classes.link}
                        key={item.id}
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
                                                render={(record?: Customer) =>
                                                    record
                                                        ? `${record.first_name} ${record.last_name}`
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
    );
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
