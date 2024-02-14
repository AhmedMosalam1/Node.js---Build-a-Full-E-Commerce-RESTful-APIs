const mongoose = require('mongoose')
const slugify = require('slugify');


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Category must be required"],
        unique:[true,"Category must be unique"],
        minLength:[3,"Too Short Category Name"],
        maxLength:[32,"Too Long Category Name"]
    },
    slug:{
        type:String,
        lowercase:true,
    },
    image:{
        type:String,
    }
},
{
    timestamps:true,
})

// Created in Validation layer
// categorySchema.pre('save', function (next) {
//     this.slug = slugify(this.name, { lower: true })
//     next()
// })

const setImageURL = (doc) => {
    if (doc.image) {
      const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
      doc.image = imageUrl;
    }
  };
  // findOne, findAll and update
  categorySchema.post('init', (doc) => {
    setImageURL(doc);
  });
  
  // create
  categorySchema.post('save', (doc) => {
    setImageURL(doc);
  });
  



const categoryModel = mongoose.model('Category',categorySchema); 

module.exports = categoryModel