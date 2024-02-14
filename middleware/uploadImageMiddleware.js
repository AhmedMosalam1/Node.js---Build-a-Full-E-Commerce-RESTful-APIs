const multer = require("multer")
const ApiError = require("../utils/appError")

const multerOptions = () => {

    const multerStorage = multer.memoryStorage();
  
    const multerFilter = function (req, file, cb) {
      if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        cb(new ApiError('Only Images Allowed', 400), false);
      }
    };
  
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  
    return upload;
  };
  
  exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields);



//const upload = multer({ dest: "uploads/category" })

// // 1 - Disk Storage
// const multerStorage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null,'uploads/category')
//     },
//     filename: function(req,file,cb){
//         const ext = file.mimetype.split('/')[1]
//         const filename = `category-${Date.now()}.${ext}`
//         cb(null,filename)
//     }
// })