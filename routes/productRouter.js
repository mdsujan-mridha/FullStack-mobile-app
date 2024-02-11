

const express = require("express");

const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/new/product").post(isAuthenticatedUser, createProduct);
// get all products
router.route("/products").get(isAuthenticatedUser, getAllProducts);
// update product 
router.route("/update/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
// deleteProduct
router.route("/delete/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
// get product details 
router.route("/product/:id").get(isAuthenticatedUser, getProductDetails);


module.exports = router;