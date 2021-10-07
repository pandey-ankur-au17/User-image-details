const mongoose = require('mongoose')
const DB_URL = `mongodb+srv://survey_app:I9Z5v2ZXni3ImvhP@cluster0.rhuc5.mongodb.net/UserSignup?retryWrites=true&w=majority`

async function dbInit(){
    await mongoose.connect(DB_URL)
}

module.exports = {
    dbInit
}