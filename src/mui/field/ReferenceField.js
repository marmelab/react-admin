import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LinearProgress from 'material-ui/LinearProgress';
import { crudGetOneReferenceGrouped as crudGetOneReferenceGroupedAction } from '../../actions/referenceActions';

export class ReferenceField extends Component {
    componentDidMount() {
        this.props.crudGetOneReferenceGrouped(this.props.reference, this.props.record[this.props.source]);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.props.crudGetOneReferenceGrouped(nextProps.reference, nextProps.record[nextProps.source]);
        }
    }

    render() {
        const { record, source, reference, referenceRecord, referenceSource, basePath, allowEmpty } = this.props;
        const rootPath = basePath.split('/').slice(0, -1).join('/');
        if (!referenceRecord && !allowEmpty) {
            return <LinearProgress />;
        }
        return <Link to={`${rootPath}/${reference}/${record[source]}`}>{referenceRecord[referenceSource]}</Link>;
    }
}

ReferenceField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    allowEmpty: PropTypes.bool.isRequired,
    reference: PropTypes.string.isRequired,
    referenceSource: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    basePath: PropTypes.string.isRequired,
    crudGetOneReferenceGrouped: PropTypes.func.isRequired,
};

ReferenceField.defaultProps = {
    referenceRecord: null,
    record: {},
    allowEmpty: false,
};

function mapStateToProps(state, props) {
    return {
        referenceRecord: state.admin[props.reference].data[props.record[props.source]],
    };
}

export default connect(mapStateToProps, {
    crudGetOneReferenceGrouped: crudGetOneReferenceGroupedAction,
})(ReferenceField);
