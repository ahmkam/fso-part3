const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-mgs2v.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', phonebookSchema)

const argLength = process.argv.length

if (argLength === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      const entry = `${person.name} ${person.number}`
      console.log(entry)
    })
    mongoose.connection.close()
  })
} else if (argLength === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(response => {
    const msg = `added ${response.name} number ${response.number} to phonebook`
    console.log(msg)
    mongoose.connection.close()
  })
}
