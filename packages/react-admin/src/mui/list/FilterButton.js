import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import { MenuList } from 'material-ui/Menu';
import ContentFilter from 'material-ui-icons/FilterList';
import translate from '../../i18n/translate';
import FilterButtonMenuItem from './FilterButtonMenuItem';
import Responsive from '../../mui/layout/Responsive';

export class FilterButton extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.state = {
            open: false,
        };
        this.handleClickButton = this.handleClickButton.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    getHiddenFilters() {
        const { filters, displayedFilters, filterValues } = this.props;
        return filters.filter(
            filterElement =>
                !filterElement.props.alwaysOn &&
                !displayedFilters[filterElement.props.source] &&
                !filterValues[filterElement.props.source]
        );
    }

    handleClickButton(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
    }

    handleShow({ source, defaultValue }) {
        this.props.showFilter(source, defaultValue);
        this.setState({
            open: false,
        });
    }

    render() {
        const hiddenFilters = this.getHiddenFilters();
        const { resource } = this.props;
        const { open, anchorEl } = this.state;

        const FilterButtonMenu = (
            <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onRequestClose={this.handleRequestClose}
            >
                <MenuList>
                    {hiddenFilters.map(filterElement => (
                        <FilterButtonMenuItem
                            key={filterElement.props.source}
                            filter={filterElement.props}
                            resource={resource}
                            onShow={this.handleShow}
                        />
                    ))}
                </MenuList>
            </Popover>
        );

        return (
            <Responsive
                small={
                    <div style={{ display: 'inline-block' }}>
                        <IconButton
                            className="add-filter"
                            color="contrast"
                            onClick={this.handleClickButton}
                        >
                            <ContentFilter />
                        </IconButton>
                        {FilterButtonMenu}
                    </div>
                }
                medium={
                    hiddenFilters.length > 0 && (
                        <div style={{ display: 'inline-block' }}>
                            <Button
                                className="add-filter"
                                color="primary"
                                onClick={this.handleClickButton}
                            >
                                <ContentFilter />
                                &nbsp;
                                {this.props.translate('ra.action.add_filter')}
                            </Button>
                            {FilterButtonMenu}
                        </div>
                    )
                }
            />
        );
    }
}

FilterButton.propTypes = {
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    filterValues: PropTypes.object.isRequired,
    showFilter: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
};

export default translate(FilterButton);
