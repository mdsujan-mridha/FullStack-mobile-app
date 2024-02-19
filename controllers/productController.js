
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Product = require("../model/productModel");
const ApiFeatures = require("../utils/ApiFeatures");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const { getDataUri } = require("../utils/ImageData");


// create product 
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    const { productName, description, price, quantity, phoneNumber, location, category } = req.body;

    // console.log(req.body);

    if (!req.file) return next(new ErrorHandler("Please add image", 400));

    const file = getDataUri(req.file)

    const myCloud = await cloudinary.v2.uploader.upload(file.content);
    const image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
    };

    await Product.create({
        productName,
        description,
        price,
        quantity,
        phoneNumber,
        location,
        category,
        images: [image]
    });
    res.status(201).json({
        success: true,
        message: "Product Create successfully"
    })
});


exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 100;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .filter()
        .search()

    let products = await apiFeature.query;
    let filteredProduct = products.length;
    apiFeature.pagination(resultPerPage);
    products = await apiFeature.query.clone();



    // then send a response with a status of 200 and send the products and the count of products 
    res.status(200).json({
        success: true,
        products,
        productCount,
        filteredProduct,
        resultPerPage
    })
});

// get product  details 
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));

    }
    res.status(200).json({
        success: true,
        product,
    })
});
// update product --admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));

    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product,
    })

});

// delete product 
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "product deleted successfully",
    })
});

// get all product by admin 
exports.getAllProductAdmin = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    })
});





