import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ImageEye from 'material-ui/svg-icons/image/remove-red-eye';
import linkToRecord from '../../util/linkToRecord'

const ShowButton = ({ basePath = '', record = {} }) => <FlatButton primary label="Show" containerElement={<Link to={`${linkToRecord(basePath, record.id)}/show`} />} icon={<ImageEye />} />;

ShowButton.propTypes = {
    basePath: PropTypes.string,
    record: PropTypes.object,
};

export default ShowButton;
