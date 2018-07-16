import listPageFactory from '../support/ListPage';
import loginPageFactory from '../support/LoginPage';

describe('List Page', () => {
    const ListPagePosts = listPageFactory('/#/posts');
    const LoginPage = loginPageFactory('/#/login');

    beforeEach(() => {
        ListPagePosts.navigate();
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
            ListPagePosts.hideFilter('title');

            cy.get(ListPagePosts.elements.filter('title')).should(
                el => expect(el).to.not.exist
            );
            cy.contains('1-10 of 13');
        });

        it('should keep filters when navigating away and going back on given page', () => {
            LoginPage.navigate();
            LoginPage.login('admin', 'password');
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
    });

    describe('Bulk Actions', () => {
        it('should allow to select all items on the current page', () => {
            cy.contains('1-10 of 13');
            ListPagePosts.toggleSelectAll();
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(10)
            );
        });

        it('should allow to unselect all items on the current page', () => {
            cy.contains('1-10 of 13');
            ListPagePosts.toggleSelectAll();
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(10)
            );
            ListPagePosts.toggleSelectAll();
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(0)
            );
        });

        it('should allow to trigger a custom bulk action on selected items', () => {
            cy.contains('1-10 of 13');
            ListPagePosts.toggleSelectAll();
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(10)
            );
            ListPagePosts.applyUpdateBulkAction();
            cy.get(ListPagePosts.elements.viewsColumn).should(els =>
                expect(els).to.have.text('0000000000')
            );
        });

        it('should have unselected all items after bulk action', () => {
            cy.contains('1-10 of 13');
            ListPagePosts.toggleSelectAll();
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(10)
            );
            ListPagePosts.applyUpdateBulkAction();
            cy.get(ListPagePosts.elements.viewsColumn).should(els =>
                expect(els).to.have.text('0000000000')
            );
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(0)
            );
        });

        it('should allow to select multiple items on the current page', () => {
            cy.contains('1-10 of 13');
            ListPagePosts.toggleSelectSomeItems(3);
            cy.get(ListPagePosts.elements.selectedItem).should(els =>
                expect(els).to.have.length(3)
            );
        });

        it('should allow to trigger the delete bulk action on selected items', () => {
            cy.contains('1-10 of 13');
            ListPagePosts.toggleSelectSomeItems(3);
            ListPagePosts.applyDeleteBulkAction();
            cy.contains('1-10 of 10');
        });
    });
});
