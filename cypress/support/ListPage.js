/// <reference types="Cypress" />
/* globals cy, Cypress */

export default url => ({
    elements: {
        addFilterButton: '.add-filter',
        appLoader: '.app-loader',
        displayedRecords: '.displayed-records',
        filter: name => `.filter-field[data-source='${name}'] input`,
        filterMenuItems: `.new-filter-item`,
        menuItems: `[role=menuitem`,
        filterMenuItem: source => `.new-filter-item[data-key="${source}"]`,
        hideFilterButton: source =>
            `.filter-field[data-source="${source}"] .hide-filter`,
        nextPage: '.next-page',
        pageNumber: n => `.page-number[data-page='${n}']`,
        previousPage: '.previous-page',
        recordRows: '.datagrid-body tr',
        viewsColumn: '.datagrid-body tr td:nth-child(6)',
        datagridHeaders: 'th',
        title: '.title',
        logout: '.logout',
        bulkActionsButton: '.bulk-actions-button',
        customBulkActionsButtonMenuItem: '.bulk-actions-menu-item:first-child',
        deleteBulkActionsButtonMenuItem: '.bulk-actions-menu-item:last-child',
        selectAll: '.select-all',
        selectedItem: '.select-item input:checked',
        selectItem: '.select-item input',
    },

    navigate() {
        cy.visit(url);
    },

    async waitForDebounce() {
        await cy.wait(501); // filter debounce is of 500ms
    },

    waitUntilVisible() {
        return cy.get(this.elements.title);
    },

    waitUntilDataLoaded() {
        return cy.get(this.elements.appLoader);
    },

    // getNbRows() {
    //     return driver
    //         .findElements(this.elements.recordRows)
    //         .then(rows => rows.length);
    // },

    // getColumns() {
    //     return driver
    //         .findElements(this.elements.datagridHeaders)
    //         .then(ths => Promise.all(ths.map(th => th.getText())));
    // },

    // getViewsColumnValues() {
    //     return driver
    //         .findElements(this.elements.viewsColumn)
    //         .then(columns =>
    //             Promise.all(columns.map(column => column.getText()))
    //         );
    // },

    openFilters() {
        cy.get(this.elements.addFilterButton).click();
    },

    nextPage() {
        cy.get(this.elements.nextPage).click();
    },

    previousPage() {
        cy.get(this.elements.previousPage).click();
    },

    goToPage(n) {
        return cy.get(this.elements.pageNumber(n)).click();
    },

    setFilterValue(name, value, clearPreviousValue = true) {
        cy.get(this.elements.filter(name));
        if (clearPreviousValue) {
            cy.get(this.elements.filter(name)).clear();
        }
        if (value) {
            cy.get(this.elements.filter(name)).type(value);
        }
    },

    // async getFilterValue(name) {
    //     const filterField = await driver.findElement(
    //         this.elements.filter(name)
    //     );

    //     return await filterField.getAttribute('value');
    // },

    showFilter(name) {
        cy.get(this.elements.addFilterButton).click();

        cy.get(this.elements.filterMenuItem(name)).click();
    },

    hideFilter(name) {
        cy.get(this.elements.hideFilterButton(name)).click();
    },

    logout() {
        cy.queryByText('Logout').click();
    },

    toggleSelectAll() {
        cy.get(this.elements.selectAll).click();
    },

    toggleSelectSomeItems(count) {
        cy.get(this.elements.selectItem).then(els => {
            for (let i = 0; i < count; i++) {
                els[i].click();
            }
        });
    },

    // getSelectedItemsCount() {
    //     return driver
    //         .findElements(this.elements.selectedItem)
    //         .then(items => items.length);
    // },

    applyUpdateBulkAction() {
        cy.get(this.elements.bulkActionsButton).click();
        cy.get(this.elements.customBulkActionsButtonMenuItem).click();
    },

    applyDeleteBulkAction() {
        cy.get(this.elements.bulkActionsButton).click();
        cy.get(this.elements.deleteBulkActionsButtonMenuItem).click();
    },
});
