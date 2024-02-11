
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter product Description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
    },
    images: [
        {
            public_id: {
                type: String,
               
            },
            url: {
                type: String,
               
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"],
    },
    quantity: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    location: {
        type: String,
        required: [true, 'Enter you location'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Enter you contact']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", productSchema);