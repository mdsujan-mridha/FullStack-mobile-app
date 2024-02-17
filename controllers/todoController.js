

const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Todo = require('../model/todoModel');
const ApiFeatures = require('../utils/ApiFeatures');
const ErrorHandler = require('../utils/ErrorHandler');
// create a new todo 
exports.createTodo = catchAsyncErrors(async (req, res, next) => {

    const todo = await Todo.create(req.body);
    res.status(201).json({
        success: true,
        todo
    })
});

// get all todos
exports.getAllTodos = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 100;
    const todoCount = await Todo.countDocuments();
    const apiFeature = new ApiFeatures(Todo.find(), req.query)
        .filter()
        .search();

    let todos = await apiFeature.query;
    let filteredTodo = todos.length;
    apiFeature.pagination(resultPerPage);
    todos = await apiFeature.query.clone();

    // then send a response with a status of 200 and send the todos and the count of todos
    res.status(200).json({
        success: true,
        todos,
        todoCount,
        filteredTodo,
        resultPerPage
    })

});

// my todo 
// get logged user order 
exports.getMyTodo = catchAsyncErrors(async (req, res, next) => {
    const todos = await Todo.find({ user: req.user._id });
    // const todos = await Todo.find().populate('user', '_id').exec();
    if (!todos) {
        return next(new ErrorHandler("No collection found for you", 404))
    }
    res.status(200).json({
        success: true,
        todos,
    })
});

// get todo details
exports.getTodoDetails = catchAsyncErrors(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
        return next(new ErrorHandler('todo not found', 404));
    }

    res.status(200).json({
        success: true,
        todo,
    })

});

// update todo 
exports.updateTodo = catchAsyncErrors(async (req, res, next) => {

    let todo = await Todo.findById(req.params.id);
    if (!todo) {
        return next(new ErrorHandler('todo not found', 404));
    }
    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        todo,
    })
});

// delete todo 
exports.deleteTodo = catchAsyncErrors(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
        return next(new ErrorHandler('todo not found', 404));
    }
    await todo.deleteOne();
    res.status(200).json({
        success: true,
        message: 'todo deleted successfully'
    })
});

// get all todo by admin
exports.getAllTodoAdmin = catchAsyncErrors(async (req, res, next) => {
    const todos = await Todo.find();
    res.status(200).json({
        success: true,
        todos,
    })
})