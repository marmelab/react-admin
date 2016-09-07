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

    handleChange(event, key, payload) {
        this.props.onChange(this.props.source, payload);
    }

    render() {
        const { resource, label, source, record, referenceRecord, allowEmpty, matchingReferences, basePath, onChange, children } = this.props;
        if (!referenceRecord && !allowEmpty) {
            return <Labeled label={label}><div>&nbsp;</div></Labeled>;
        }
        return React.cloneElement(children, {
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
    children: PropTypes.element.isRequired,
    resource: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    matchingReferences: PropTypes.array,
    allowEmpty: PropTypes.bool.isRequired,
    reference: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    basePath: PropTypes.string,
    onChange: PropTypes.func,
    crudGetOne: PropTypes.func.isRequired,
    crudGetMatching: PropTypes.func.isRequired,
    includesLabel: PropTypes.bool.isRequired,
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
