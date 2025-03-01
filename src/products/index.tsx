import ProductIcon from '@mui/icons-material/Collections';
import ProductList from './ProductList';
import ProductEdit from './ProductEdit';
import ProductCreate from './ProductCreate';
import { Product } from '../types';

export default {
    list: ProductList,
    create: ProductCreate,
    edit: ProductEdit,
    icon: ProductIcon,
    recordRepresentation: (record: Product) => `"${record.reference}"`,
};
