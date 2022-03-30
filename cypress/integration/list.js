import listPageFactory from '../support/ListPage';
import loginPageFactory from '../support/LoginPage';

describe('List Page', () => {
    const ListPagePosts = listPageFactory('/#/posts');
    const ListPageUsers = listPageFactory('/#/users');
    const LoginPage = loginPageFactory('/#/login');

    beforeEach(() => {
        ListPagePosts.navigate();
    });

    describe('Title', () => {
        it('should show the correct title in the appBar', () => {
            cy.get(ListPagePosts.elements.title).contains('Posts');
        });
    });

    describe('Pagination', () => {
        it('should display paginated list of available posts', () => {
            cy.contains('1-10 of 13');
        });

        it('should switch page when clicking on previous/next page buttons or page numbers', () => {
            ListPagePosts.nextPage();
            cy.contains('11-13 of 13');

            ListPagePosts.previousPage();
            cy.contains('1-10 of 13');

            ListPagePosts.goToPage(2);
            cy.contains('11-13 of 13');
        });
    });

    describe('Filtering', () => {
        it('should display `alwaysOn` filters by default', () => {
            cy.get(ListPagePosts.elements.filter('q')).should(
                el => expect(el).to.exist
            );
        });

        it('should filter directly while typing (with some debounce)', () => {
            ListPagePosts.setFilterValue('q', 'quis culpa impedit');
            cy.get(ListPagePosts.elements.recordRows).should(el =>
                expect(el).to.have.length(1)
            );
            cy.contains('Omnis voluptate enim similique est possimus');
            cy.contains('1-1 of 1');
            ListPagePosts.setFilterValue('q', '', true);
            cy.contains('1-10 of 13');
        });

        it('should display new filter when clicking on "Add Filter"', () => {
            ListPagePosts.showFilter('title');

            cy.get(ListPagePosts.elements.filter('title')).should(
                el => expect(el).to.exist
            );

            cy.contains('1-1 of 1');

            ListPagePosts.hideFilter('title');
            cy.contains('1-10 of 13');
        });

        it('should hide filter when clicking on hide button', () => {
            ListPagePosts.showFilter('title');
            cy.contains('1-1 of 1');
            ListPagePosts.hideFilter('title');

            cy.get(ListPagePosts.elements.filter('title')).should(
                el => expect(el).to.not.exist
            );
            cy.contains('1-10 of 13');
        });

        it('should keep filters when navigating away and going back on given page', () => {
            ListPagePosts.logout();
            LoginPage.login('admin', 'password');
            ListPagePosts.navigate();
            ListPagePosts.setFilterValue('q', 'quis culpa impedit');
            cy.contains('1-1 of 1');

            // This validates that defaultFilterValues on the user list is
            // not kept for posts after navigation.
            // See https://github.com/marmelab/react-admin/pull/2019
            cy.get('[href="#/users"]').click();
            cy.contains('1-2 of 2');

            cy.get('[href="#/posts"]').click();

            cy.get(ListPagePosts.elements.filter('q')).should(el =>
                expect(el).to.have.value('quis culpa impedit')
            );
            cy.contains('1-1 of 1');
            ListPagePosts.setFilterValue('q', '');
        });

        it('should keep added filters when emptying it after navigating away and back', () => {
            ListPagePosts.logout();
            LoginPage.login('admin', 'password');
            ListPagePosts.navigate();
            ListPagePosts.showFilter('title');
            // Let's clear the filter first, otherwise we have no way of knowing when the new filter has been (debounced and) applied
            ListPagePosts.setFilterValue('title', '');
            cy.contains('1-10 of 13');
            // Now let's change the filter to something different than the default value
            ListPagePosts.setFilterValue(
                'title',
                'Omnis voluptate enim similique est possimus'
            );
            cy.contains('1-1 of 1');
            // Navigate away and then back
            cy.get('[href="#/users"]').click();
            cy.get('[href="#/posts"]').click();
            // Check that our filter has been preserved
            cy.get(ListPagePosts.elements.filter('title')).should(el =>
                expect(el).to.have.value(
                    'Omnis voluptate enim similique est possimus'
                )
            );
        });

        it('should allow to disable alwaysOn filters with default value', () => {
            ListPagePosts.logout();
            LoginPage.login('admin', 'password');
            ListPageUsers.navigate();
            cy.contains('1-2 of 2');
            cy.get('button[title="Remove this filter"]').click();
            cy.contains('1-3 of 3');
        });
    });

    describe('Bulk Actions', () => {
        it('should allow to select all items on the current page', () => {
            cy.contains('1-10 of 13'); // wait for data
            ListPagePosts.toggleSelectAll();
            cy.get(ListPagePosts.elements.bulkActionsToolbar).should(
                'be.visible'
            );
            cy.contains('10 items selected');
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(10)
            );
        });

        it('should allow to unselect all items on the current page', () => {
            cy.contains('1-10 of 13'); // wait for data
            ListPagePosts.toggleSelectAll();
            cy.get(ListPagePosts.elements.bulkActionsToolbar).should(
                'be.visible'
            );
            ListPagePosts.toggleSelectAll();
            cy.get(ListPagePosts.elements.bulkActionsToolbar).should(
                'not.be.visible'
            );
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(0)
            );
        });

        it('should allow to trigger a custom bulk action on selected items', () => {
            cy.contains('1-10 of 13'); // wait for data
            ListPagePosts.toggleSelectAll();
            ListPagePosts.applyUpdateBulkAction();
            cy.get(ListPagePosts.elements.viewsColumn).should(els =>
                expect(els).to.have.text('0000000000')
            );
        });

        it('should have unselected all items after bulk action', () => {
            cy.contains('1-10 of 13'); // wait for data
            ListPagePosts.toggleSelectAll();
            ListPagePosts.applyUpdateBulkAction();
            cy.get(ListPagePosts.elements.bulkActionsToolbar).should(
                'not.be.visible'
            );
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(0)
            );
        });

        it('should allow to select multiple items on the current page', () => {
            cy.contains('1-10 of 13'); // wait for data
            ListPagePosts.toggleSelectSomeItems(3);
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(3)
            );
        });

        it('should allow to trigger the delete bulk action on selected items', () => {
            cy.contains('1-10 of 13'); // wait for data
            ListPagePosts.toggleSelectSomeItems(3);
            ListPagePosts.applyDeleteBulkAction();
            cy.contains('1-10 of 10');
        });

        it('should allow to select items with the shift key on different pages', () => {
            cy.contains('1-10 of 13'); // wait for data
            cy.get(ListPagePosts.elements.selectItem).eq(0).click();
            cy.get(ListPagePosts.elements.selectItem)
                .eq(2)
                .click({ shiftKey: true });
            cy.contains('3 items selected');
            ListPagePosts.nextPage();
            cy.contains('11-13 of 13'); // wait for data
            cy.get(ListPagePosts.elements.selectedItem).should(els => {
                expect(els).to.have.length(0);
            });
            cy.get(ListPagePosts.elements.selectItem).eq(0).click();
            cy.get(ListPagePosts.elements.selectItem)
                .eq(2)
                .click({ shiftKey: true });
            cy.contains('6 items selected');
        });
    });

    describe('rowClick', () => {
        it('should accept a function', () => {
            cy.contains(
                'Fusce massa lorem, pulvinar a posuere ut, accumsan ac nisi'
            )
                .parents('tr')
                .click();
            cy.contains('Summary').should(el => expect(el).to.exist);
        });

        it('should accept a function returning a promise', () => {
            ListPagePosts.logout();
            LoginPage.login('user', 'password');
            ListPageUsers.navigate();
            cy.contains('Annamarie Mayer').parents('tr').click();
            cy.contains('Summary').should(el => expect(el).to.exist);
        });
    });

    describe('expand panel', () => {
        it('should show an expand button opening the expand element', () => {
            cy.contains('1-10 of 13'); // wait for data
            cy.get('[aria-label="Expand"]')
                .eq(0)
                .click()
                .should(el => expect(el).to.have.attr('aria-expanded', 'true'))
                .should(el => expect(el).to.have.attr('aria-label', 'Close'));

            cy.get('#13-expand').should(el =>
                expect(el).to.contain(
                    'Curabitur eu odio ullamcorper, pretium sem at, blandit libero. Nulla sodales facilisis libero, eu gravida tellus ultrices nec. In ut gravida mi. Vivamus finibus tortor tempus egestas lacinia. Cras eu arcu nisl. Donec pretium dolor ipsum, eget feugiat urna iaculis ut.'
                )
            );
        });

        it('should accept multiple expands', () => {
            cy.contains('1-10 of 13'); // wait for data
            cy.get('[aria-label="Expand"]')
                .eq(0)
                .click()
                .should(el => expect(el).to.have.attr('aria-expanded', 'true'))
                .should(el => expect(el).to.have.attr('aria-label', 'Close'));

            cy.get('#13-expand').should(el => expect(el).to.exist);

            cy.get('[aria-label="Expand"]')
                .eq(0) // We still target the first button labeled Expand because the previous one should now have a Close label
                .click()
                .should(el => expect(el).to.have.attr('aria-expanded', 'true'))
                .should(el => expect(el).to.have.attr('aria-label', 'Close'));

            cy.get('#12-expand').should(el => expect(el).to.exist);
        });
    });

    describe('Sorting', () => {
        it('should display a sort arrow when clicking on a sortable column header', () => {
            ListPagePosts.toggleColumnSort('id');
            cy.get(ListPagePosts.elements.svg('id')).should('be.visible');

            ListPagePosts.toggleColumnSort('tags.name');
            cy.get(ListPagePosts.elements.svg('tags.name')).should(
                'be.visible'
            );
        });

        it('should hide the sort arrow when clicking on another sortable column header', () => {
            ListPagePosts.toggleColumnSort('published_at');
            cy.get(ListPagePosts.elements.svg('id')).should('be.hidden');
            cy.get(ListPagePosts.elements.svg('tags.name')).should('be.hidden');
        });

        it('should reverse the sort arrow when clicking on an already sorted column header', () => {
            ListPagePosts.toggleColumnSort('published_at');
            ListPagePosts.toggleColumnSort('tags.name');
            cy.get(
                ListPagePosts.elements.svg(
                    'tags.name',
                    '[class*=iconDirectionAsc]'
                )
            ).should('exist');

            ListPagePosts.toggleColumnSort('tags.name');
            cy.get(
                ListPagePosts.elements.svg(
                    'tags.name',
                    '[class*=iconDirectionDesc]'
                )
            ).should('exist');
        });

        it('should keep filters when sorting a column', () => {
            ListPagePosts.setFilterValue('q', 'quis culpa impedit');
            cy.get(ListPagePosts.elements.recordRows).should(el =>
                expect(el).to.have.length(1)
            );

            ListPagePosts.toggleColumnSort('title');
            ListPagePosts.waitUntilDataLoaded();

            cy.get(ListPagePosts.elements.filter('q')).should(
                'have.value',
                'quis culpa impedit'
            );
        });
    });
});
