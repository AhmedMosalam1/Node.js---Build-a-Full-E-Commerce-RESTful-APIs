const mongoose = require('mongoose');

const db = () => {

    mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log('Connect DataBase Successfully')
})
.catch((err) => {
    console.log(err)
})

}

module.exports = db
