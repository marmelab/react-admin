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
        logout: '.logout',
        bulkActionsToolbar: '[data-test=bulk-actions-toolbar]',
        customBulkActionsButton:
            '[data-test=bulk-actions-toolbar] button:first-child',
        deleteBulkActionsButton:
            '[data-test=bulk-actions-toolbar] button:last-child',
        selectAll: '.select-all',
        selectedItem: '.select-item input:checked',
        selectItem: '.select-item input',
        userMenu: 'button[title="Profile"]',
        title: '#react-admin-title',
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        return cy.get(this.elements.title);
    },

    waitUntilDataLoaded() {
        return cy.get(this.elements.appLoader);
    },

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

    showFilter(name) {
        cy.get(this.elements.addFilterButton).click();

        cy.get(this.elements.filterMenuItem(name)).click();
    },

    hideFilter(name) {
        cy.get(this.elements.hideFilterButton(name)).click();
    },

    logout() {
        cy.get(this.elements.userMenu).click();
        cy.get(this.elements.logout).click();
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

    applyUpdateBulkAction() {
        cy.get(this.elements.customBulkActionsButton).click();
    },

    applyDeleteBulkAction() {
        cy.get(this.elements.deleteBulkActionsButton).click();
    },
});
