const catchAsync = require("express-async-handler")
const ApiError = require('../utils/appError')
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = (model) => catchAsync(async (req, res, next) => {
    const id = req.params.id

    const doc = await model.findById(id)

    if (!doc) {
        return next(new ApiError(`Can't find ${model} on this id`, 404));
    }

    await doc.remove()


    res.status(201).json({
        status: "deleted success",
    })
})

exports.deleteAll = (model) => catchAsync(async (req, res, next) => {

    await model.remove()

    res.status(201).json({
        status: "Delete All Successfully",
    })
})

exports.getOne = (model,popOption) => catchAsync(async (req, res, next) => {
    const id = req.params.id

    let doc =  await model.findById(id)
    if(popOption){
         doc =  await doc.populate(popOption) 
    }
    
    if (!doc) {
        return next(new ApiError(`Can't find ${model} on this id`, 404));
    }

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.updateOne = (model) => catchAsync(async (req, res, next) => {

    const doc = await model.findByIdAndUpdate(req.params.id, req.body, { new: true }) //new is true => to return new doc after update

    if (!doc) {
        return next(new ApiError(`Can't find Brand on this id`, 404));
    }

    doc.save()

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.createOne = (model) => catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.getAll = (model,modelName=' ') => catchAsync(async (req, res) => {
    // let id = {}
    // if(req.params.categoryId) {
    //      id = {category:req.params.categoryId}
    // }else if(req.params.productId){
    //     id = {product:req.params.productId}
    // }

    let filter = {};
    if(req.filterObj){
        filter = req.filterObj
    }

    // Build query
    const documentsCounts = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
