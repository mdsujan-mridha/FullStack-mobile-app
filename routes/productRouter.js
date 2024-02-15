

const express = require("express");

const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductDetails,
    getAllProductAdmin } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/new/product").post(isAuthenticatedUser,createProduct);
// get all products
router.route("/products").get(getAllProducts);
// update product 
// get all product by admin 
router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAllProductAdmin);
router.route("/update/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
// deleteProduct
router.route("/delete/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
// get product details 
router.route("/product/:id").get(getProductDetails);


module.exports = router;