import template from 'lodash/template';

export const renderTemplate = (templateString: string, data: any) => {
    try {
        return template(templateString)(data);
    } catch (e) {
        return '_template error_';
    }
};
