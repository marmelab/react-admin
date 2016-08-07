import React, { PropTypes } from 'react';

const Title = ({ defaultTitle, record, title }) => {
    if (!title) {
        return <span>{defaultTitle}</span>;
    }
    if (typeof title === 'string') {
        return <span>{title}</span>;
    }
    return React.createElement(title, { record });
};

Title.propTypes = {
    defaultTitle: PropTypes.string.isRequired,
    record: PropTypes.object,
    title: PropTypes.any,
};

export default Title;
