const fs = require('fs');
require('colors');
require("dotenv").config();
const Product = require('../../models/productModel');
const dbConnection = require('../../config/database');

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));


// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);

    console.log('Data Inserted'.green.inverse); //colors
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed'.red.inverse); //colors
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}