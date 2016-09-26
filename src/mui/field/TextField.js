import React, { PropTypes } from 'react';

const TextField = ({ source, record = {}, type }) => {
    switch (type) {
    case 'email':
        return <a href={'mailto:' + record[source]}>{record[source]}</a>;

    case 'url':
        return <a href={record[source]}>{record[source]}</a>;

    case 'password':
        return <span>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</span>

    default:
        return <span>{record[source]}</span>;
    }
};

TextField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    type: PropTypes.string,
};

export default TextField;
