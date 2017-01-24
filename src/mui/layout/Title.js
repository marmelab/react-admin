import React, { PropTypes } from 'react';
import Translate from '../../i18n/Translate';

const Title = ({ defaultTitle, record, title, translate }) => {
    if (!title) {
        return <span>{defaultTitle}</span>;
    }
    if (typeof title === 'string') {
        return <span>{translate(title, { _: defaultTitle })}</span>;
    }
    return React.cloneElement(title, { record });
};

Title.propTypes = {
    defaultTitle: PropTypes.string.isRequired,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
};

export default Translate(Title);
