const express = require("express");
const morgan = require('morgan')
const cors = require("cors");

const app = express();

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

// app.use(morgan('tiny'))
morgan.token('body', (req, res) => {
  JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(cors())

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id; // dont have to convert to number because it is a string in the object
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    console.log("not found");
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end(); // 204 no content
});

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name || !body.number) {
        if(!body.name && !body.number) {
            return res.status(400).json({
                error: 'name and number missing'
            })
        }
        if(!body.name) {
            return res.status(400).json({
                error: 'name missing'
            })
        }
        if(!body.number) {
            return res.status(400).json({
                error: 'number missing'
            })
        }
    }
    if(persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: String(Math.floor(Math.random() * 1000)),
        name: body.name,
        number: body.number
    }

    persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
