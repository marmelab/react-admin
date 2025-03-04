import { generateCustomers } from './customers';
import { generateCategories } from './categories';
import { generateProducts } from './products';
import { generateOrders } from './orders';
import { generateInvoices } from './invoices';
import { generateReviews } from './reviews';
import finalize from './finalize';
var generateData = function () {
    var db = {};
    db.customers = generateCustomers();
    db.categories = generateCategories();
    db.products = generateProducts(db);
    db.orders = generateOrders(db);
    db.invoices = generateInvoices(db);
    db.reviews = generateReviews(db);
    finalize(db);
    return db;
};
export default generateData;
//# sourceMappingURL=index.js.map