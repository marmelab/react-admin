import generateCustomers from './customers';
import generateCategories from './categories';
import generateProducts from './products';
import generateCommands from './commands';
import generateReviews from './reviews';
import finalize from './finalize';

export default () => {
    const db = {};
    db.customers = generateCustomers(db);
    db.categories = generateCategories(db);
    db.products = generateProducts(db);
    db.commands = generateCommands(db);
    db.reviews = generateReviews(db);
    finalize(db);

    return db;
};
