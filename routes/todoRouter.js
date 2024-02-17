

const express = require('express');

const {
    createTodo,
    getAllTodos,
    getTodoDetails,
    updateTodo,
    deleteTodo,
    getAllTodoAdmin,
    getMyTodo
} = require('../controllers/todoController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route("/todo/new").post(isAuthenticatedUser, createTodo);
// get todo user 
router.route("/todos").get(isAuthenticatedUser, getAllTodos);
// get a single todo
router.route("/todo/:id").get(isAuthenticatedUser, getTodoDetails);
// get logged user todo 
router.route("/my/todo").get(isAuthenticatedUser, getMyTodo);
// update to 
router.route("/todo/:id").put(isAuthenticatedUser, updateTodo);
// deleteTodo
router.route("/todo/:id").delete(isAuthenticatedUser, deleteTodo);
// get all todo by admin
router.route("/admin/todos").get(isAuthenticatedUser, authorizeRoles("admin"), getAllTodoAdmin);

module.exports = router;