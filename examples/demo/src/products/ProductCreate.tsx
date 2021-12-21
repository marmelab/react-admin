import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Create,
    FormTab,
    NumberInput,
    ReferenceInput,
    SelectInput,
    TabbedForm,
    TextInput,
    required,
    CreateProps,
} from 'react-admin';
import { InputAdornment } from '@mui/material';
import { RichTextInput } from 'ra-input-rich-text';

const PREFIX = 'ProductCreate';

const classes = {
    price: `${PREFIX}-price`,
    width: `${PREFIX}-width`,
    height: `${PREFIX}-height`,
    stock: `${PREFIX}-stock`,
    widthFormGroup: `${PREFIX}-widthFormGroup`,
    heightFormGroup: `${PREFIX}-heightFormGroup`,
};

const StyledCreate = styled(Create)({
    [`& .${classes.price}`]: { width: '7em' },
    [`& .${classes.width}`]: { width: '7em' },
    [`& .${classes.height}`]: { width: '7em' },
    [`& .${classes.stock}`]: { width: '7em' },
    [`& .${classes.widthFormGroup}`]: { display: 'inline-block' },
    [`& .${classes.heightFormGroup}`]: {
        display: 'inline-block',
        marginLeft: 32,
    },
});

const ProductCreate = (props: CreateProps) => {
    return (
        <StyledCreate {...props}>
            <TabbedForm>
                <FormTab label="resources.products.tabs.image">
                    <TextInput
                        autoFocus
                        source="image"
                        fullWidth
                        validate={required()}
                    />
                    <TextInput
                        source="thumbnail"
                        fullWidth
                        validate={required()}
                    />
                </FormTab>
                <FormTab label="resources.products.tabs.details" path="details">
                    <TextInput source="reference" validate={required()} />
                    <NumberInput
                        source="price"
                        validate={required()}
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
                        validate={required()}
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
                        validate={required()}
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
                    <ReferenceInput
                        source="category_id"
                        reference="categories"
                        allowEmpty
                    >
                        <SelectInput source="name" />
                    </ReferenceInput>
                    <NumberInput
                        source="stock"
                        validate={required()}
                        className={classes.stock}
                    />
                </FormTab>
                <FormTab
                    label="resources.products.tabs.description"
                    path="description"
                >
                    <RichTextInput source="description" label="" />
                </FormTab>
            </TabbedForm>
        </StyledCreate>
    );
};

export default ProductCreate;
