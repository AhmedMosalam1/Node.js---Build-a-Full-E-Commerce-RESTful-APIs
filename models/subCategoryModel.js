const mongoose = require('mongoose')
const slugify = require('slugify');


const subCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Subcategory must be required"],
        unique:[true,"Subcategory must be unique"],
        trim:true,
        minLength:[2,"Too Short Subcategory Name"],
        maxLength:[32,"Too Long Subcategory Name"]
    },
    slug:{
        type:String,
        lowercase:true,
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:"Category" ,
        required:[true,"Subcategory must be belong to parent category"]
    }
},
{
    timestamps:true,
})

// Created in Validation layer
// subCategorySchema.pre('save', function (next) {
//     this.slug = slugify(this.name, { lower: true })
//     next()
// })


// additional query for more time and less performance
// subCategorySchema.pre(/^find/, function (next) { 
//     this.populate({
//         path: "category",
//         select: "name -_id"
//     })
//     next()
// })




const subCategoryModel = mongoose.model('SubCategory',subCategorySchema); 

module.exports = subCategoryModel