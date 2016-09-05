import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
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
        const { record, label, source, referenceRecord, referenceSource, allowEmpty, matchingReferences, options } = this.props;
        if (!referenceRecord && !allowEmpty) {
            return <TextField floatingLabelText={label} />;
        }
        // FIXME use autocomplete as soon as material-ui knows how to handle it
        return (
            <SelectField menuStyle={{ maxHeight: '41px', overflowY: 'hidden' }} floatingLabelText={label} value={record[source]} onChange={::this.handleChange} autoWidth {...options} >
                {matchingReferences.map(reference =>
                    <MenuItem key={reference.id} value={reference.id} primaryText={reference[referenceSource]} />
                )}
            </SelectField>
        );
    }
}

ReferenceInput.propTypes = {
    resource: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    matchingReferences: PropTypes.array,
    allowEmpty: PropTypes.bool.isRequired,
    reference: PropTypes.string.isRequired,
    referenceSource: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    options: PropTypes.object,
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
    includesLabel: true,
};

function mapStateToProps(state, props) {
    const referenceId = props.record[props.source];
    return {
        referenceRecord: state.admin[props.reference].data[referenceId],
        matchingReferences: getPossibleReferences(state, referenceSource(props.resource, props.source), props.reference, referenceId),
    };
}

export default connect(mapStateToProps, {
    crudGetOne: crudGetOneAction,
    crudGetMatching: crudGetMatchingAction,
})(ReferenceInput);
