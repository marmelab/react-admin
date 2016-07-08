import React, { Component, PropTypes } from 'react';

class Resource extends Component {
    render() {
        // throw new Error('<Resource> elements are for router configuration only and should not be rendered');
        return <div>hello</div>;
    }
}

Resource.PropTypes = {
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
};

export default Resource;
