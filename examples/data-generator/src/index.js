import generateCustomers from './customers';
import generateCategories from './categories';
import generateProducts from './products';
import generateCommands from './commands';
import generateReviews from './reviews';
import finalize from './finalize';

export default (options = { serializeDate: true }) => {
    const db = {};
    db.customers = generateCustomers(db, options);
    db.categories = generateCategories(db, options);
    db.products = generateProducts(db, options);
    db.commands = generateCommands(db, options);
    db.reviews = generateReviews(db, options);
    finalize(db);

    return db;
};
