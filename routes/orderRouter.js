

const express = require('express');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const {
    createOrder,
    getSingleOrder,
    getAllOrders,
    getMyOrders,
    deleteOrder,
    updateOrder } = require('../controllers/orderController');

const router = express.Router();

//  new order 
router.route("/order/new").post(isAuthenticatedUser, createOrder);
//  order details --admin
router.route("/order/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder)
// get all orders by admin 
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

// delete or update order by admin 
router.route("/admin/order/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
;
// get logged user order --user 
router.route("/orders/me").get(isAuthenticatedUser, getMyOrders);


module.exports = router;