import createPageFactory from '../support/CreatePage';
import editPageFactory from '../support/EditPage';
import listPageFactory from '../support/ListPage';
import loginPageFactory from '../support/LoginPage';

describe('Edit Page', () => {
    const EditPostPage = editPageFactory('/#/posts/5');
    const ListPagePosts = listPageFactory('/#/posts');
    const CreatePostPage = createPageFactory('/#/posts/create');
    const EditCommentPage = editPageFactory('/#/comments/5');
    const LoginPage = loginPageFactory('/#/login');
    const EditUserPage = editPageFactory('/#/users/3');
    const CreateUserPage = createPageFactory('/#/users/create');

    describe('Title', () => {
        it('should show the correct title in the appBar', () => {
            EditPostPage.navigate();
            cy.get(EditPostPage.elements.title).contains(
                'Post "Sed quo et et fugiat modi"'
            );
        });
    });

    describe('TabbedForm', () => {
        beforeEach(() => EditPostPage.navigate());

        it('should display the title in a TextField', () => {
            cy.get(EditPostPage.elements.input('title')).should(el =>
                expect(el).to.have.value('Sed quo et et fugiat modi')
            );
        });

        it('should allow to update elements', () => {
            EditPostPage.setInputValue('input', 'title', 'Lorem Ipsum');
            EditPostPage.submit();
            // Ensure react-admin has handled the update as it will redirect to the list page
            // once done
            cy.url().should(url => expect(url).to.match(/.*\/posts$/));
            EditPostPage.navigate();
            cy.get(EditPostPage.elements.input('title')).should(el =>
                expect(el).to.have.value('Lorem Ipsum')
            );
        });

        it('should redirect to list page after edit success', () => {
            EditPostPage.setInputValue('input', 'title', 'Lorem Ipsum +');
            EditPostPage.submit();
            cy.url().then(url => expect(url).to.contain('/#/posts'));
        });

        it('should allow to switch tabs', () => {
            EditPostPage.gotoTab(3);
            cy.get(EditPostPage.elements.input('average_note')).should(el =>
                expect(el).to.have.value('3')
            );
        });

        it('should keep DateInput value after opening datapicker', () => {
            EditPostPage.gotoTab(3);
            const date = new Date('2012-08-05').toISOString().slice(0, 10);
            cy.get(EditPostPage.elements.input('published_at')).should(el =>
                expect(el).to.have.value(date)
            );

            EditPostPage.clickInput('published_at');

            cy.get(EditPostPage.elements.input('published_at')).should(el =>
                expect(el).to.have.value(date)
            );
        });

        it('should validate inputs inside ArrayInput', () => {
            EditPostPage.gotoTab(3);

            cy.get(EditPostPage.elements.addBacklinkButton).click();

            EditPostPage.clickInput('backlinks[0].url');
            cy.get(EditPostPage.elements.input('backlinks[0].url')).blur();

            cy.contains('Required');
            // FIXME: We navigate away from the page and confirm the unsaved changes
            // This is needed because HashHistory would prevent further navigation
            cy.window().then(win => {
                cy.on('window:confirm', () => true);
            });
            cy.get('[role="menuitem"]:first-child').click();
        });

        it('should change reference list correctly when changing filter', () => {
            const EditPostTagsPage = editPageFactory('/#/posts/13');
            EditPostTagsPage.navigate();
            EditPostTagsPage.gotoTab(3);

            // Music is selected by default
            cy.get(
                EditPostTagsPage.elements.input('tags', 'reference-array-input')
            ).within(() => {
                cy.get(`[role=button]`).contains('Music').should('exist');
            });

            EditPostTagsPage.clickInput('change-filter');

            // Music should not be selected anymore after filter reset
            cy.get(
                EditPostTagsPage.elements.input('tags', 'reference-array-input')
            ).within(() => {
                cy.get(`[role=button]`).should('not.exist');
            });

            cy.get(
                EditPostTagsPage.elements.input('tags', 'reference-array-input')
            ).within(() => {
                cy.get(`input`).click();
            });

            // Music should not be visible in the list after filter reset
            cy.get('[role="listbox"]').within(() => {
                cy.contains('Music').should('not.exist');
            });
            cy.get('[role="listbox"]').within(() => {
                cy.contains('Photo').should('exist');
            });
        });
    });

    it('should fill form correctly even when switching from one form type to another', () => {
        EditCommentPage.navigate();
        cy.get(EditPostPage.elements.input('author.name')).should(el =>
            expect(el).to.have.value('Edmond Schulist')
        );

        // This validate that the current redux form values are not kept after we navigate
        EditCommentPage.setInputValue('input', 'body', 'Test');

        cy.on('window:confirm', message => {
            expect(message).to.equal(
                "Some of your changes weren't saved. Are you sure you want to ignore them?"
            );
        });
        // FIXME
        // We can't navigate using cypress function as it would prevent the confirm dialog
        // to appear. This is because react-router (history) cannot block history pushes that
        // it didn't initiate.
        cy.contains('Create post').click();

        cy.get(CreatePostPage.elements.input('body', 'rich-text-input')).should(
            el =>
                // When the Quill editor is empty, it add the "ql-blank" CSS class
                expect(el).to.have.class('ql-blank')
        );
    });

    it('should allow to select an item from the AutocompleteInput without showing the choices again after', () => {
        EditCommentPage.navigate();
        cy.get(
            '[value="Accusantium qui nihil voluptatum quia voluptas maxime ab similique - 1"]'
        );
        cy.wait(500);
        cy.get(EditCommentPage.elements.input('post_id'))
            .type('{selectall}')
            .clear()
            .type('Sed quo');
        cy.contains('[role="option"]', 'Sed quo et et fugiat modi').click();
        cy.get('[role="option"]').should(el => expect(el).to.not.exist);

        // Ensure it does not reappear a little after
        cy.wait(500);
        cy.get('[role="option"]').should(el => expect(el).to.not.exist);

        // Ensure they still appear when needed though
        cy.get(EditCommentPage.elements.input('post_id'))
            .clear()
            .type('Accusantium qui nihil');

        // We select the original value so that the form stay pristine and we avoid the
        // warning about unsaved changes that prevents the following tests to run
        cy.contains(
            '[role="option"]',
            'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
        ).click();
    });

    it('should reset the form correctly when switching from edit to create', () => {
        EditPostPage.navigate();
        cy.get(EditPostPage.elements.input('title')).should(el =>
            expect(el).to.have.value('Sed quo et et fugiat modi')
        );

        // This validate that the current redux form values are not kept after we navigate
        EditPostPage.setInputValue('input', 'title', 'Another title');

        cy.on('window:confirm', message => {
            expect(message).to.equal(
                "Some of your changes weren't saved. Are you sure you want to ignore them?"
            );
        });
        // FIXME
        // We can't navigate using cypress function as it would prevent the confirm dialog
        // to appear. This is because react-router (history) cannot block history pushes that
        // it didn't initiate.
        cy.contains('Create').click();
        cy.get(CreatePostPage.elements.input('title')).should(el =>
            expect(el).to.have.value('')
        );

        // This validate the old record values are not kept after we navigated
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().slice(0, 10);

        cy.get(CreatePostPage.elements.input('published_at')).should(el =>
            expect(el).to.have.value(currentDateString)
        );
    });

    it('should intialize the form correctly when cloning from edit', () => {
        EditPostPage.navigate();
        cy.get(EditPostPage.elements.input('title')).should(el =>
            expect(el).to.have.value('Sed quo et et fugiat modi')
        );

        EditPostPage.clone();
        cy.url().then(url => expect(url).to.contain('/#/posts/create'));
        cy.get(CreatePostPage.elements.input('title')).should(el =>
            expect(el).to.have.value('Sed quo et et fugiat modi')
        );

        const date = new Date('2012-08-05').toISOString().slice(0, 10);
        cy.get(CreatePostPage.elements.input('published_at')).should(el =>
            expect(el).to.have.value(date)
        );
    });

    it('should not revert values when saving a record that was cloned', () => {
        EditPostPage.navigate();
        cy.get(EditPostPage.elements.input('title')).should(el =>
            expect(el).to.have.value('Sed quo et et fugiat modi')
        );

        EditPostPage.clone();
        CreatePostPage.setInputValue('input', 'title', 'Lorem Ipsum');

        // The next assertion has to occur immediately, thus CreatePostPage.submit() is not used
        cy.get(CreatePostPage.elements.submitButton).click();

        cy.get(CreatePostPage.elements.input('title')).then(el => {
            expect(el).to.have.value('Lorem Ipsum');
        });
    });

    it('should not lose the cloned values when switching tabs', () => {
        EditPostPage.navigate();
        EditPostPage.logout();
        LoginPage.navigate();
        LoginPage.login('admin', 'password');
        EditUserPage.navigate();
        cy.get(EditUserPage.elements.input('name')).should(el =>
            expect(el).to.have.value('Annamarie Mayer')
        );
        EditUserPage.clone();
        cy.get(CreateUserPage.elements.input('name')).then(el => {
            expect(el).to.have.value('Annamarie Mayer');
        });
        CreateUserPage.gotoTab(2);
        CreateUserPage.gotoTab(1);
        cy.get(CreateUserPage.elements.input('name')).then(el => {
            expect(el).to.have.value('Annamarie Mayer');
        });
    });

    it('should persit emptied inputs', () => {
        EditPostPage.navigate();
        EditPostPage.gotoTab(3);
        cy.contains('Tech').click();
        cy.get('li[aria-label="Clear value"]').click();
        EditPostPage.submit();
        ListPagePosts.waitUntilDataLoaded();

        EditPostPage.navigate();
        EditPostPage.gotoTab(3);
        cy.get(EditPostPage.elements.input('category')).should(el =>
            expect(el).to.have.value('')
        );
    });

    // FIXME unskip me when useGetList uses the react-query API
    it.skip('should refresh the list when the update fails', () => {
        ListPagePosts.navigate();
        ListPagePosts.nextPage(); // Ensure the record is visible in the table

        EditPostPage.navigate();
        EditPostPage.setInputValue('input', 'title', 'f00bar');
        EditPostPage.submit();
        ListPagePosts.waitUntilDataLoaded();

        cy.get(ListPagePosts.elements.recordRows)
            .eq(2)
            .should(el => expect(el).to.contain('f00bar'));

        cy.get('body').click('left'); // dismiss notification

        cy.get('div[role="alert"]').should(el =>
            expect(el).to.have.text('this title cannot be used')
        );

        cy.get(ListPagePosts.elements.recordRows)
            .eq(2)
            .should(el => expect(el).to.contain('Sed quo et et fugiat modi'));
    });

    it('should not display a warning about unsaved changes when an array input has been updated', () => {
        ListPagePosts.navigate();
        ListPagePosts.nextPage(); // Ensure the record is visible in the table

        EditPostPage.navigate();
        // Select first notification input checkbox
        cy.get(
            EditPostPage.elements.input('notifications', 'checkbox-group-input')
        )
            .eq(0)
            .click();

        EditPostPage.submit();

        // If the update succeeded without display a warning about unsaved changes,
        // we should have been redirected to the list
        cy.url().then(url => expect(url).to.contain('/#/posts'));
    });
});
