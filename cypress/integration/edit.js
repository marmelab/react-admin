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
    });

    it('should fill form correctly even when switching from one form type to another', () => {
        EditCommentPage.navigate();
        cy.get(EditPostPage.elements.input('author.name')).should(el =>
            expect(el).to.have.value('Edmond Schulist')
        );

        // This validate that the current redux form values are not kept after we navigate
        EditCommentPage.setInputValue('input', 'body', 'Test');

        CreatePostPage.navigate();

        cy.get(CreatePostPage.elements.input('body', 'rich-text-input')).should(
            el =>
                // When the Quill editor is empty, it add the "ql-blank" CSS class
                expect(el).to.have.class('ql-blank')
        );
    });

    it('should allow to select an item from the AutocompleteInput without showing the choices again after', () => {
        EditCommentPage.navigate();
        cy.get(EditCommentPage.elements.input('post_id'))
            .clear()
            .type('Sed quo');
        cy.get('[role="tooltip"]').within(() => {
            cy.contains('Sed quo et et fugiat modi').click();
        });
        cy.get('[role="tooltip"]').should(el => expect(el).to.not.exist);

        // Ensure it does not reappear a little after
        cy.wait(500);
        cy.get('[role="tooltip"]').should(el => expect(el).to.not.exist);

        // Ensure they still appear when needed though
        cy.get(EditCommentPage.elements.input('post_id'))
            .clear()
            .type('architecto aut');
        cy.get('[role="tooltip"]').within(() => {
            cy.contains('Sint dignissimos in architecto aut');
        });
    });

    it('should reset the form correctly when switching from edit to create', () => {
        EditPostPage.navigate();
        cy.get(EditPostPage.elements.input('title')).should(el =>
            expect(el).to.have.value('Sed quo et et fugiat modi')
        );

        // This validate that the current redux form values are not kept after we navigate
        EditPostPage.setInputValue('input', 'title', 'Another title');

        CreatePostPage.navigate();
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

        EditPostPage.navigate();
        EditPostPage.gotoTab(3);
        cy.get(EditPostPage.elements.input('category')).should(el =>
            expect(el).to.have.value('')
        );
    });

    it('should refresh the list when the update fails', () => {
        ListPagePosts.navigate();
        ListPagePosts.nextPage(); // Ensure the record is visible in the table

        EditPostPage.navigate();
        EditPostPage.setInputValue('input', 'title', 'f00bar');
        EditPostPage.submit();

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
});
