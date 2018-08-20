import createPageFactory from '../support/CreatePage';
import editPageFactory from '../support/EditPage';

describe('Edit Page', () => {
    const EditPostPage = editPageFactory('/#/posts/5');
    const CreatePostPage = createPageFactory('/#/posts/create');
    const EditCommentPage = editPageFactory('/#/comments/5');

    describe('TabbedForm', () => {
        beforeEach(() => EditPostPage.navigate());

        it('should display the title in a TextField', () => {
            cy.get(EditPostPage.elements.input('title')).should(el =>
                expect(el).to.have.value('Sed quo et et fugiat modi')
            );
        });

        it('should allow to update elements', () => {
            EditPostPage.setInputValue('title', 'Lorem Ipsum');
            EditPostPage.submit();
            EditPostPage.navigate();
            cy.get(EditPostPage.elements.input('title')).should(el =>
                expect(el).to.have.value('Lorem Ipsum')
            );
        });

        it('should redirect to list page after edit success', () => {
            EditPostPage.setInputValue('title', 'Lorem Ipsum +');
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

        EditPostPage.navigate();
        cy.get(EditPostPage.elements.input('title')).should(el =>
            expect(el).to.have.value('Sed quo et et fugiat modi')
        );
    });

    it('should reset the form correctly when switching from edit to create', () => {
        EditPostPage.navigate();
        cy.get(EditPostPage.elements.input('title')).should(el =>
            expect(el).to.have.value('Sed quo et et fugiat modi')
        );

        CreatePostPage.navigate();
        cy.get(CreatePostPage.elements.input('title')).should(el =>
            expect(el).to.have.value('')
        );
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().slice(0, 10);

        cy.get(CreatePostPage.elements.input('published_at')).should(el =>
            expect(el).to.have.value(currentDateString)
        );
    });
});
