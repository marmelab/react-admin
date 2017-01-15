import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ImageEye from 'material-ui/svg-icons/image/remove-red-eye';
import linkToRecord from '../../util/linkToRecord'

const ShowButton = ({ basePath = '', label = 'Show', record = {} }) => <FlatButton
    primary
    label={label}
    icon={<ImageEye />}
    containerElement={<Link to={`${linkToRecord(basePath, record.id)}/show`} />}
    style={{ overflow: 'inherit' }}
/>;

ShowButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
};

export default ShowButton;
