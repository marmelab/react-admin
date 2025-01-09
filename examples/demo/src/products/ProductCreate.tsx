import * as React from 'react';
import {
    Create,
    TabbedForm,
    TextInput,
    required,
    useDefaultTitle,
    useGetResourceLabel,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { ProductEditDetails } from './ProductEditDetails';
const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);

const ProductTitle = () => {
    const title = useDefaultTitle();
    const translate = useTranslate();
    const resource = useResourceContext();
    const getResourceLabel = useGetResourceLabel();
    if (!resource) {
        throw new Error(
            'useCreateController requires a non-empty resource prop or context'
        );
    }
    const defaultTitle = translate('ra.page.create', {
        name: getResourceLabel(resource, 1),
    });
    return (
        <>
            <title>{`${title} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const ProductCreate = () => (
    <Create title={<ProductTitle />}>
        <TabbedForm defaultValues={{ sales: 0 }}>
            <TabbedForm.Tab
                label="resources.products.tabs.image"
                sx={{ maxWidth: '40em' }}
            >
                <TextInput autoFocus source="image" validate={required()} />
                <TextInput source="thumbnail" validate={required()} />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="resources.products.tabs.details"
                path="details"
                sx={{ maxWidth: '40em' }}
            >
                <ProductEditDetails />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="resources.products.tabs.description"
                path="description"
            >
                <RichTextInput source="description" label="" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Create>
);

export default ProductCreate;
