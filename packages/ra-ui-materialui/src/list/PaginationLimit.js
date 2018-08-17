import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import compose from 'recompose/compose';
import { translate } from 'ra-core';

const PaginationLimit = ({ page, total, translate }) => {
    if (total === 0) {
        return (
            <CardContent>
                <Typography variant="body1">
                    {translate('ra.navigation.no_results')}
                </Typography>
            </CardContent>
        );
    }

    return (
        <CardContent>
            <Typography variant="body1">
                {translate('ra.navigation.no_more_results', { page })}
            </Typography>
        </CardContent>
    );
};

PaginationLimit.propTypes = {
    ids: PropTypes.array,
    page: PropTypes.number,
    total: PropTypes.number,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    pure,
    translate
);

export default enhance(PaginationLimit);
