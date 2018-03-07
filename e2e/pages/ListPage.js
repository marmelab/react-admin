import { By, until } from 'selenium-webdriver';

export default url => driver => ({
    elements: {
        addFilterButton: By.css('.add-filter'),
        appLoader: By.css('.app-loader'),
        confirmButton: By.css('.ra-confirm'),
        displayedRecords: By.css('.displayed-records'),
        filter: name => By.css(`.filter-field[data-source='${name}'] input`),
        filterMenuItems: By.css(`.new-filter-item`),
        menuItems: By.css(`[role=menuitem`),
        filterMenuItem: source =>
            By.css(`.new-filter-item[data-key="${source}"]`),
        hideFilterButton: source =>
            By.css(`.filter-field[data-source="${source}"] .hide-filter`),
        nextPage: By.css('.next-page'),
        pageNumber: n => By.css(`.page-number[data-page='${n}']`),
        previousPage: By.css('.previous-page'),
        recordRows: By.css('.datagrid-body tr'),
        viewsColumn: By.css('.datagrid-body tr td:nth-child(6)'),
        datagridHeaders: By.css('th'),
        title: By.css('.title'),
        logout: By.css('.logout'),
        bulkActionsButton: By.css('.bulk-actions-button'),
        customBulkActionsButtonMenuItem: By.css(
            '.bulk-actions-menu-item:first-child'
        ),
        deleteBulkActionsButtonMenuItem: By.css(
            '.bulk-actions-menu-item:last-child'
        ),
        selectAll: By.css('.select-all'),
        selectedItem: By.css('.select-item input:checked'),
        selectItem: By.css('.select-item input'),
    },

    navigate() {
        driver.navigate().to(url);
        return this.waitUntilDataLoaded();
    },

    waitUntilVisible() {
        return driver.wait(until.elementLocated(this.elements.title));
    },

    waitUntilDataLoaded() {
        let continued = true;
        return driver
            .wait(until.elementLocated(this.elements.appLoader), 2000)
            .catch(() => (continued = false)) // no loader - we're on the same page !
            .then(
                () =>
                    continued
                        ? driver.wait(
                              until.stalenessOf(
                                  driver.findElement(this.elements.appLoader)
                              )
                          )
                        : true
            )
            .catch(() => {}) // The element might have disapeared before the wait on the previous line
            .then(() => driver.sleep(100)); // let some time to redraw;
    },

    getNbRows() {
        return driver
            .findElements(this.elements.recordRows)
            .then(rows => rows.length);
    },

    getColumns() {
        return driver
            .findElements(this.elements.datagridHeaders)
            .then(ths => Promise.all(ths.map(th => th.getText())));
    },

    getViewsColumnValues() {
        return driver
            .findElements(this.elements.viewsColumn)
            .then(columns =>
                Promise.all(columns.map(column => column.getText()))
            );
    },

    getResources() {
        return driver
            .findElements(this.elements.menuItems)
            .then(menuItems =>
                Promise.all(menuItems.map(menuItem => menuItem.getText()))
            );
    },

    getAvailableFilters() {
        const addFilterButton = driver.findElement(
            this.elements.addFilterButton
        );
        addFilterButton.click();

        driver.wait(until.elementLocated(this.elements.filterMenuItems));

        return driver
            .findElements(this.elements.filterMenuItems)
            .then(filters =>
                Promise.all(filters.map(filter => filter.getText()))
            );
    },

    getNbPagesText() {
        return driver.findElement(this.elements.displayedRecords).getText();
    },

    nextPage() {
        return driver
            .findElement(this.elements.nextPage)
            .then(element =>
                driver
                    .executeScript(
                        'arguments[0].scrollIntoView(true);',
                        element
                    )
                    .then(() => element)
            )
            .then(element => driver.sleep(250).then(() => element))
            .then(element => element.click())
            .then(() => this.waitUntilDataLoaded());
    },

    previousPage() {
        return driver
            .findElement(this.elements.previousPage)
            .then(element =>
                driver
                    .executeScript(
                        'arguments[0].scrollIntoView(true);',
                        element
                    )
                    .then(() => element)
            )
            .then(element => driver.sleep(250).then(() => element))
            .then(element => element.click())
            .then(() => this.waitUntilDataLoaded());
    },

    goToPage(n) {
        return driver
            .findElement(this.elements.pageNumber(n))
            .then(element =>
                driver
                    .executeScript(
                        'arguments[0].scrollIntoView(true);',
                        element
                    )
                    .then(() => element)
            )
            .then(element => driver.sleep(250).then(() => element))
            .then(element => element.click())
            .then(() => this.waitUntilDataLoaded());
    },

    setFilterValue(name, value, clearPreviousValue = true) {
        const filterField = driver.findElement(this.elements.filter(name));
        if (clearPreviousValue) {
            filterField.clear();
        }

        filterField.sendKeys(value);

        // Filling an input with no value doesn't trigger key events.
        // Hence, let's blur it!
        const body = driver.findElement(By.css('body'));
        body.click();

        return this.waitUntilDataLoaded();
    },

    async getFilterValue(name) {
        const filterField = await driver.findElement(
            this.elements.filter(name)
        );

        return await filterField.getAttribute('value');
    },

    async showFilter(name) {
        const addFilterButton = await driver.findElement(
            this.elements.addFilterButton
        );
        await addFilterButton.click();

        await driver.wait(
            until.elementLocated(this.elements.filterMenuItem(name))
        );

        const menuItem = await driver.findElement(
            this.elements.filterMenuItem(name)
        );
        await menuItem.click();

        await this.waitUntilDataLoaded();
    },

    hideFilter(name) {
        const hideFilterButton = driver.findElement(
            this.elements.hideFilterButton(name)
        );
        hideFilterButton.click();
        return this.waitUntilDataLoaded(); // wait for debounce and reload
    },

    logout() {
        driver.findElement(this.elements.logout).click();
    },

    toggleSelectAll() {
        return driver
            .findElement(this.elements.selectAll)
            .click()
            .then(
                () => driver.sleep(1000) // wait until animations end
            );
    },

    toggleSelectSomeItems(count) {
        return driver
            .findElements(this.elements.selectItem)
            .then(elements =>
                Promise.all(
                    [...Array(count).keys()].map(index => {
                        elements[index].click();
                    })
                )
            )
            .then(() => driver.sleep(1000)); // wait until animations end
    },

    getSelectedItemsCount() {
        return driver
            .findElements(this.elements.selectedItem)
            .then(items => items.length);
    },

    applyUpdateBulkAction() {
        return driver
            .findElement(this.elements.bulkActionsButton)
            .click()
            .then(() =>
                driver.wait(
                    until.elementLocated(
                        this.elements.customBulkActionsButtonMenuItem
                    ),
                    500
                )
            ) // wait until animations end
            .then(() =>
                driver
                    .findElement(this.elements.customBulkActionsButtonMenuItem)
                    .click()
            )
            .then(() =>
                driver.wait(
                    until.elementLocated(this.elements.confirmButton),
                    500
                )
            ) // wait until animations end
            .then(() => driver.findElement(this.elements.confirmButton).click())
            .then(() => this.waitUntilDataLoaded())
            .then(() => driver.sleep(500)) // wait until animations end
            .then(() => this.waitUntilDataLoaded());
    },

    applyDeleteBulkAction() {
        return driver
            .findElement(this.elements.bulkActionsButton)
            .click()
            .then(() =>
                driver.wait(
                    until.elementLocated(
                        this.elements.deleteBulkActionsButtonMenuItem
                    ),
                    500
                )
            ) // wait until animations end
            .then(() =>
                driver
                    .findElement(this.elements.deleteBulkActionsButtonMenuItem)
                    .click()
            )
            .then(() =>
                driver.wait(
                    until.elementLocated(this.elements.confirmButton),
                    500
                )
            ) // wait until animations end
            .then(() => driver.findElement(this.elements.confirmButton).click())
            .then(() => driver.sleep(500)) // wait until animations end
            .then(() => this.waitUntilDataLoaded())
            .then(() => driver.sleep(500)) // wait until animations end
            .then(() => this.waitUntilDataLoaded());
    },
});
