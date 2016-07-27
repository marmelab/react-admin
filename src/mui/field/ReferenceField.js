import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { crudGetOneReference as crudGetOneReferenceAction } from '../../actions/referenceActions';

export class ReferenceField extends Component {
    componentDidMount() {
        this.props.crudGetOneReference(this.props.reference, this.props.record[this.props.source]);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.props.crudGetOneReference(nextProps.reference, nextProps.record[nextProps.source]);
        }
    }

    render() {
        const { record, source, reference, referenceRecord, referenceSource, basePath } = this.props;
        const rootPath = basePath.split('/').slice(0, -1).join('/');
        return <Link to={`${rootPath}/${reference}/${record[source]}`}>{referenceRecord[referenceSource]}</Link>;
    }
}

ReferenceField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceSource: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    basePath: PropTypes.string.isRequired,
    crudGetOneReference: PropTypes.func.isRequired,
};

ReferenceField.defaultProps = {
    referenceRecord: {},
    record: {},
};

function mapStateToProps(state, props) {
    return {
        referenceRecord: state[props.reference].data[props.record[props.source]],
    };
}

export default connect(mapStateToProps, {
    crudGetOneReference: crudGetOneReferenceAction,
})(ReferenceField);
