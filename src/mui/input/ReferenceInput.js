import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Labeled from './Labeled';
import { crudGetOne as crudGetOneAction, crudGetMatching as crudGetMatchingAction } from '../../actions/dataActions';
import { getPossibleReferences } from '../../reducer/references/possibleValues';

const referenceSource = (resource, source) => `${resource}@${source}`;

export class ReferenceInput extends Component {
    componentDidMount() {
        const { reference, record, source, resource } = this.props;
        this.fetchReferenceAndOptions(reference, record[source], referenceSource(resource, source));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            const { reference, record, source, resource } = nextProps;
            this.fetchReferenceAndOptions(reference, record[source], referenceSource(resource, source));
        }
    }

    fetchReferenceAndOptions(reference, id, relatedTo) {
        if (id) {
            this.props.crudGetOne(reference, id, null, false);
        }
        this.props.crudGetMatching(reference, relatedTo, {});
    }

    render() {
        const { input, resource, label, source, record, referenceRecord, allowEmpty, matchingReferences, basePath, onChange, children } = this.props;
        if (!referenceRecord && !allowEmpty) {
            return <Labeled label={label} source={source} />;
        }

        return React.cloneElement(children, {
            input,
            label,
            resource,
            source,
            record,
            choices: matchingReferences,
            basePath,
            onChange,
        });
    }
}

ReferenceInput.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    crudGetMatching: PropTypes.func.isRequired,
    crudGetOne: PropTypes.func.isRequired,
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    matchingReferences: PropTypes.array,
    onChange: PropTypes.func,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    resource: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
};

ReferenceInput.defaultProps = {
    referenceRecord: null,
    record: {},
    allowEmpty: false,
    matchingReferences: [],
};

function mapStateToProps(state, props) {
    const referenceId = props.record[props.source];
    return {
        referenceRecord: state.admin[props.reference].data[referenceId],
        matchingReferences: getPossibleReferences(state, referenceSource(props.resource, props.source), props.reference, referenceId),
    };
}

const ConnectedReferenceInput = connect(mapStateToProps, {
    crudGetOne: crudGetOneAction,
    crudGetMatching: crudGetMatchingAction,
})(ReferenceInput);

ConnectedReferenceInput.defaultProps = {
    includesLabel: true,
};

export default ConnectedReferenceInput;
