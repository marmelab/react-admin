import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import shouldUpdate from 'recompose/shouldUpdate';
import FlatButton from 'material-ui/FlatButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import linkToRecord from '../../util/linkToRecord';

const EditButton = ({ basePath = '', label = 'Edit', record = {} }) => <FlatButton
    primary
    label={label}
    icon={<ContentCreate />}
    containerElement={<Link to={linkToRecord(basePath, record.id)} />}
    style={{ overflow: 'inherit' }}
/>;

EditButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
};

export default shouldUpdate((props, nextProps) =>
    props.record.id !== nextProps.record.id
    || props.basePath !== nextProps.basePath
)(EditButton);
