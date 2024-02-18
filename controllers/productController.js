
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Product = require("../model/productModel");
const ApiFeatures = require("../utils/ApiFeatures");
const cloudinary = require("cloudinary");

// create product 
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    const imageLink = [];
    for (let i = 0; i < images?.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });
        imageLink.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    req.body.images = imageLink;
    req.body.user = req.user.id;
    console.log(req.body);
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
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





