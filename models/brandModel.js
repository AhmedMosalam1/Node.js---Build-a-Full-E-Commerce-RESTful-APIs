const mongoose = require('mongoose')
const slugify = require('slugify');


const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"brand must be required"],
        unique:[true,"brand must be unique"],
        minLength:[3,"Too Short brand Name"],
        maxLength:[32,"Too Long brand Name"]
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
// brandSchema.pre('save', function (next) { 
//     this.slug = slugify(this.name, { lower: true })
//     next()
// })

const setImageURL = (doc) => {
    if (doc.image) {
      const imageUrl = `${process.env.BASE_URL}/brand/${doc.image}`;
      doc.image = imageUrl;
    }
  };
  // findOne, findAll and update
  // brandSchema.post('init', (doc) => {
  //   setImageURL(doc);
  // });
  
  // create
  brandSchema.post('save', (doc) => {
    setImageURL(doc);
  });
  

const brandModel = mongoose.model('Brand',brandSchema); 

module.exports = brandModel
