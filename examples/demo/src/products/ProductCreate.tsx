import * as React from 'react';
import {
    Create,
    TabbedForm,
    TextInput,
    required,
    useDefaultTitle,
    useGetResourceLabel,
    useTranslate,
} from 'react-admin';
import { ProductEditDetails } from './ProductEditDetails';
const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);

const ProductTitle = () => {
    const appTitle = useDefaultTitle();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const pageTitle = translate('ra.page.create', {
        name: getResourceLabel('products', 1),
    });
    return (
        <>
            <title>{`${appTitle} - ${pageTitle}`}</title>
            <span>{pageTitle}</span>
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
