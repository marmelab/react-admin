import createPageFactory from '../support/CustomFormPage';
import editPageFactory from '../support/EditPage';

describe('Custom Forms', () => {
    const CreatePage = createPageFactory('#/comments/create');
    const EditPage = editPageFactory('#/posts/14');

    beforeEach(() => CreatePage.navigate());

    it('should allows to preview the selected post', () => {
        cy.get(CreatePage.elements.postSelect).click();
        cy.get(CreatePage.elements.postItem(12)).click();

        cy.get(CreatePage.elements.showPostPreviewModalButton).click();

        cy.contains('Qui tempore rerum et voluptates');
        cy.contains(
            'Occaecati rem perferendis dolor aut numquam cupiditate. At tenetur dolores pariatur et libero asperiores porro voluptas. Officiis corporis sed eos repellendus perferendis distinctio hic consequatur.'
        );

        cy.get(CreatePage.elements.modalCloseButton).click();
    });

    it('should allows to create a new post', () => {
        cy.get(CreatePage.elements.showPostCreateModalButton).click();

        CreatePage.setInputValue('input', 'title', 'Bazinga!');
        CreatePage.setInputValue('textarea', 'teaser', 'Bazingaaaaaaaa!');
        cy.get(CreatePage.elements.modalSubmitButton).click();
        cy.contains('Bazinga!');
        EditPage.navigate();
        EditPage.delete();
    });
});
