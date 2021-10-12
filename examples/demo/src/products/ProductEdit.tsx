import * as React from 'react';
import {
    Datagrid,
    DateField,
    Edit,
    EditButton,
    EditProps,
    FormTab,
    NumberInput,
    Pagination,
    ReferenceInput,
    ReferenceManyField,
    required,
    SelectInput,
    TabbedForm,
    TextField,
    TextInput,
} from 'react-admin';
import { InputAdornment, styled } from '@mui/material';
import RichTextInput from 'ra-input-rich-text';

import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from '../reviews/StarRatingField';
import Poster from './Poster';
import { Product } from '../types';

interface ProductTitleProps {
    record?: Product;
}

const ProductTitle = ({ record }: ProductTitleProps) =>
    record ? <span>Poster #{record.reference}</span> : null;

const PREFIX = 'ProductEdit';

const classes = {
    price: `${PREFIX}-price`,
    width: `${PREFIX}-width`,
    height: `${PREFIX}-height`,
    stock: `${PREFIX}-stock`,
    widthFormGroup: `${PREFIX}-widthFormGroup`,
    heightFormGroup: `${PREFIX}-heightFormGroup`,
    comment: `${PREFIX}-comment`,
    tab: `${PREFIX}-tab`,
};

const StyledEdit = styled(Edit)({
    [`& .${classes.price}`]: { width: '7em' },
    [`& .${classes.width}`]: { width: '7em' },
    [`& .${classes.height}`]: { width: '7em' },
    [`& .${classes.stock}`]: { width: '7em' },
    [`& .${classes.widthFormGroup}`]: { display: 'inline-block' },
    [`& .${classes.heightFormGroup}`]: {
        display: 'inline-block',
        marginLeft: 32,
    },
    [`& .${classes.comment}`]: {
        maxWidth: '20em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    [`& .${classes.tab}`]: {
        maxWidth: '40em',
        display: 'block',
    },
});

const ProductEdit = (props: EditProps) => (
    <StyledEdit {...props} title={<ProductTitle />}>
        <TabbedForm>
            <FormTab
                label="resources.products.tabs.image"
                contentClassName={classes.tab}
            >
                <Poster />
                <TextInput
                    source="image"
                    fullWidth
                    validate={requiredValidate}
                />
                <TextInput
                    source="thumbnail"
                    fullWidth
                    validate={requiredValidate}
                />
            </FormTab>
            <FormTab
                label="resources.products.tabs.details"
                path="details"
                contentClassName={classes.tab}
            >
                <TextInput source="reference" validate={requiredValidate} />
                <NumberInput
                    source="price"
                    className={classes.price}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">€</InputAdornment>
                        ),
                    }}
                    validate={requiredValidate}
                />
                <NumberInput
                    source="width"
                    className={classes.width}
                    formClassName={classes.widthFormGroup}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">cm</InputAdornment>
                        ),
                    }}
                    validate={requiredValidate}
                />
                <NumberInput
                    source="height"
                    className={classes.height}
                    formClassName={classes.heightFormGroup}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">cm</InputAdornment>
                        ),
                    }}
                    validate={requiredValidate}
                />
                <ReferenceInput
                    source="category_id"
                    reference="categories"
                    validate={requiredValidate}
                >
                    <SelectInput source="name" />
                </ReferenceInput>
                <NumberInput
                    source="stock"
                    className={classes.stock}
                    validate={requiredValidate}
                />
                <NumberInput
                    source="sales"
                    className={classes.stock}
                    validate={requiredValidate}
                />
            </FormTab>
            <FormTab
                label="resources.products.tabs.description"
                path="description"
                contentClassName={classes.tab}
            >
                <RichTextInput
                    source="description"
                    label=""
                    validate={requiredValidate}
                />
            </FormTab>
            <FormTab label="resources.products.tabs.reviews" path="reviews">
                <ReferenceManyField
                    reference="reviews"
                    target="product_id"
                    addLabel={false}
                    pagination={<Pagination />}
                    fullWidth
                >
                    <Datagrid>
                        <DateField source="date" />
                        <CustomerReferenceField />
                        <StarRatingField />
                        <TextField
                            source="comment"
                            cellClassName={classes.comment}
                        />
                        <TextField source="status" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
        </TabbedForm>
    </StyledEdit>
);

const requiredValidate = [required()];

export default ProductEdit;
