const mongoose = require('mongoose')
require('dotenv').config();

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://brandonrwong:${password}@cluster0.ca8n1fo.mongodb.net/phoneBook?
retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
    Person.find({}).then(persons => {
        console.log('phonebook:')
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else if(process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number  
    })
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}