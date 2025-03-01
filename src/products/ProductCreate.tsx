import * as React from 'react';
import {
    Create,
    TabbedForm,
    TextInput,
    required,
    useCreateContext,
    useDefaultTitle,
} from 'react-admin';
import { ProductEditDetails } from './ProductEditDetails';
const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);

const ProductTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useCreateContext();

    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
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
