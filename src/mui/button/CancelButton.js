import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import translate from '../../i18n/translate';
import CancelIcon from 'material-ui/svg-icons/notification/do-not-disturb';
import {Link} from 'react-router';

const CancelButton = ({ basePath = '', label = 'aor.action.cancel', raised = true, translate }) => <RaisedButton
    type="submit"
    label={label && translate(label)}
    icon={<CancelIcon/>}
    containerElement={<Link to={basePath} />}
    secondary
    style={{
        margin: '10px 24px',
        position: 'relative',
    }}
/>;

CancelButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    raised: PropTypes.bool,
    translate: PropTypes.func.isRequired,
};

export default translate(CancelButton);