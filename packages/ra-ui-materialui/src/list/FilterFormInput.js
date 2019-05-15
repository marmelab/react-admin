import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import IconButton from '@material-ui/core/IconButton';
import ActionHide from '@material-ui/icons/HighlightOff';
import classnames from 'classnames';
import { translate } from 'ra-core';

const emptyRecord = {};

const sanitizeRestProps = ({ alwaysOn, ...props }) => props;

const FilterFormInput = ({
    filterElement,
    handleHide,
    classes,
    resource,
    translate,
    locale,
}) => (
    <div
        data-source={filterElement.props.source}
        className={classnames('filter-field', classes.body)}
    >
        {!filterElement.props.alwaysOn && (
            <IconButton
                className="hide-filter"
                onClick={handleHide}
                data-key={filterElement.props.source}
                title={translate('ra.action.remove_filter')}
            >
                <ActionHide />
            </IconButton>
        )}
        <Field
            allowEmpty
            {...sanitizeRestProps(filterElement.props)}
            name={filterElement.props.source}
            component={filterElement.type}
            resource={resource}
            record={emptyRecord}
        />
        <div className={classes.spacer}>&nbsp;</div>
    </div>
);

FilterFormInput.propTypes = {
    filterElement: PropTypes.node,
    handleHide: PropTypes.func,
    classes: PropTypes.object,
    resource: PropTypes.string,
    locale: PropTypes.string,
    translate: PropTypes.func,
};

export default translate(FilterFormInput);
