import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

const buttonStyle = { margin: '10px 0' };

export class Pagination extends Component {
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

    getNbPages() {
        return Math.ceil(this.props.total / this.props.perPage) || 1;
    }

    prevPage = (event) => {
        event.stopPropagation();
        if (this.props.page === 1) {
            throw new Error('Cannot go before page 1');
        }
        this.props.setPage(this.props.page - 1);
    }

    nextPage = (event) => {
        event.stopPropagation();
        if (this.props.page > this.getNbPages()) {
            throw new Error('Cannot after last page');
        }
        this.props.setPage(this.props.page + 1);
    }

    gotoPage = (event) => {
        event.stopPropagation();
        const page = event.currentTarget.dataset.page;
        if (page < 1 || page > this.getNbPages()) {
            throw new Error(`Page number ${page} out of boundaries`);
        }
        this.props.setPage(page);
    }

    renderPageNums() {
        return this.range().map((pageNum, index) =>
            (pageNum === '.') ?
                <span key={`hyphen_${index}`} style={{ padding: '1.2em' }}>&hellip;</span> :
                <FlatButton key={pageNum} label={pageNum} data-page={pageNum} onClick={this.gotoPage} primary={pageNum !== this.props.page} style={buttonStyle} />
        );
    }

    render() {
        const { page, perPage, total } = this.props;
        if (total === 0) return null;
        const offsetEnd = Math.min(page * perPage, total);
        const offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd);
        const nbPages = this.getNbPages();

        return (
            <Toolbar>
                <ToolbarGroup firstChild>
                    <span style={{ padding: '1.2em' }} >{offsetBegin}-{offsetEnd} of {total}</span>
                </ToolbarGroup>
                {nbPages > 1 &&
                    <ToolbarGroup>
                    {page > 1 &&
                        <FlatButton primary key="prev" label="Prev" icon={<ChevronLeft />} onClick={this.prevPage} style={buttonStyle} />
                    }
                    {this.renderPageNums()}
                    {page !== nbPages &&
                        <FlatButton primary key="next" label="Next" icon={<ChevronRight />} labelPosition="before" onClick={this.nextPage} style={buttonStyle} />
                    }
                    </ToolbarGroup>
                }
            </Toolbar>
        );
    }
}

Pagination.propTypes = {
    page: PropTypes.number,
    perPage: PropTypes.number,
    total: PropTypes.number,
    setPage: PropTypes.func,
};

export default Pagination;
