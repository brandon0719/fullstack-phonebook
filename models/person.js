const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URL

console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

//Validator for personSchema
const phoneValidator = {
    validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v) && v.length === 12
    },
    message: props => `${props.value} is not a valid phone number! (must be in the format: 123-456-7890)`
}

const personSchema = new mongoose.Schema({
    name: { 
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: phoneValidator
    }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
}) 

module.exports = mongoose.model('Person', personSchema)