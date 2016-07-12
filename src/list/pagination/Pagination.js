import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import * as actions from './actions';

export class Pagination extends Component {
    constructor(props) {
        super(props);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.gotoPage = this.gotoPage.bind(this);
    }

    range() {
        const input = [];
        const { page, perPage, total } = this.props;
        const nbPages = Math.ceil(total / perPage) || 1;

        // display page links around the current page
        if (page > 2) {
            input.push('1');
        }
        if (page === 4) {
            input.push('2');
        }
        if (page > 4) {
            input.push('.');
        }
        if (page > 1) {
            input.push(page - 1);
        }
        input.push(page);
        if (page < nbPages) {
            input.push(page + 1);
        }
        if (page === (nbPages - 3)) {
            input.push(nbPages - 1);
        }
        if (page < (nbPages - 3)) {
            input.push('.');
        }
        if (page < (nbPages - 1)) {
            input.push(nbPages);
        }

        return input;
    }

    prevPage(event) {
        event.stopPropagation();
        this.props.prevPage(this.props.resource);
    }

    nextPage(event) {
        event.stopPropagation();
        this.props.nextPage(this.props.resource);
    }

    gotoPage(event) {
        event.stopPropagation();
        this.props.gotoPage(this.props.resource, event.currentTarget.dataset.page);
    }

    renderPageNums() {
        return this.range().map(pageNum =>
            (pageNum === '.') ?
                <span style={{ padding: '1.2em' }}>&hellip;</span> :
                <FlatButton key={pageNum} label={pageNum} data-page={pageNum} onClick={this.gotoPage} primary={pageNum === this.props.page} />
        );
    }

    render() {
        const { page, perPage, total } = this.props;
        if (total === 0) return null;
        const offsetEnd = Math.min(page * perPage, total);
        const offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd);
        const nbPages = Math.ceil(total / perPage) || 1;

        return (
            <Toolbar>
                <ToolbarGroup firstChild>
                    <span style={{ padding: '1.2em' }} >{offsetBegin}-{offsetEnd} of {total}</span>
                </ToolbarGroup>
                <ToolbarGroup>
                { page > 1 ? <FlatButton key="prev" label="Prev" icon={<ChevronLeft />} onClick={this.prevPage}/> : '' }
                { this.renderPageNums() }
                { page != nbPages ? <FlatButton key="next" label="Next" icon={<ChevronRight/>} labelPosition="before" onClick={this.nextPage}/> : '' }
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

Pagination.propTypes = {
    resource: PropTypes.string.isRequired,
    page: PropTypes.number,
    perPage: PropTypes.number,
    total: PropTypes.number,
    prevPage: PropTypes.func.isRequired,
    nextPage: PropTypes.func.isRequired,
    gotoPage: PropTypes.func.isRequired,
};

export default connect(
  (state, props) => props,
  actions,
)(Pagination);
