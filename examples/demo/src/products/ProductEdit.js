import React from 'react';
import {
    Datagrid,
    DateField,
    Edit,
    EditButton,
    FormTab,
    NumberInput,
    Pagination,
    ReferenceInput,
    ReferenceManyField,
    SelectInput,
    TabbedForm,
    TextField,
    TextInput,
} from 'react-admin';
import { InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';

import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from '../reviews/StarRatingField';
import Poster from './Poster';
import { styles as createStyles } from './ProductCreate';

const ProductTitle = ({ record }) => <span>Poster #{record.reference}</span>;

const styles = {
    ...createStyles,
    comment: {
        maxWidth: '20em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

const useStyles = makeStyles(styles);

const ProductEdit = props => {
    const classes = useStyles();
    return (
        <Edit {...props} title={<ProductTitle />}>
            <TabbedForm>
                <FormTab label="resources.products.tabs.image">
                    <Poster />
                    <TextInput source="image" fullWidth />
                    <TextInput source="thumbnail" fullWidth />
                </FormTab>
                <FormTab label="resources.products.tabs.details" path="details">
                    <TextInput source="reference" />
                    <NumberInput
                        source="price"
                        className={classes.price}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    €
                                </InputAdornment>
                            ),
                        }}
                    />
                    <NumberInput
                        source="width"
                        className={classes.width}
                        formClassName={classes.widthFormGroup}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    cm
                                </InputAdornment>
                            ),
                        }}
                    />
                    <NumberInput
                        source="height"
                        className={classes.height}
                        formClassName={classes.heightFormGroup}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    cm
                                </InputAdornment>
                            ),
                        }}
                    />
                    <ReferenceInput source="category_id" reference="categories">
                        <SelectInput source="name" />
                    </ReferenceInput>
                    <NumberInput source="stock" className={classes.stock} />
                </FormTab>
                <FormTab
                    label="resources.products.tabs.description"
                    path="description"
                >
                    <RichTextInput source="description" label="" />
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
        </Edit>
    );
};

export default ProductEdit;
