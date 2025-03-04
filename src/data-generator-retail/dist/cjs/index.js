"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var customers_1 = require("./customers");
var categories_1 = require("./categories");
var products_1 = require("./products");
var orders_1 = require("./orders");
var invoices_1 = require("./invoices");
var reviews_1 = require("./reviews");
var finalize_1 = __importDefault(require("./finalize"));
var generateData = function () {
    var db = {};
    db.customers = (0, customers_1.generateCustomers)();
    db.categories = (0, categories_1.generateCategories)();
    db.products = (0, products_1.generateProducts)(db);
    db.orders = (0, orders_1.generateOrders)(db);
    db.invoices = (0, invoices_1.generateInvoices)(db);
    db.reviews = (0, reviews_1.generateReviews)(db);
    (0, finalize_1.default)(db);
    return db;
};
exports.default = generateData;
//# sourceMappingURL=index.js.map