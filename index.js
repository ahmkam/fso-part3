const express = require("express");
const app = express();
app.use(express.static("build"));
app.use(express.json());

const morgan = require("morgan");

const cors = require("cors");
app.use(cors());

morgan.token("data", function(request, response) {
  if (request.method === "POST") return JSON.stringify(request.body);
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :data")
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  }
];

app.get("/", (req, res) => {
  res.send("<h1>Welcome to phonebook</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (req, res) => {
  var timestap = new Date().toString();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>\n ${timestap}`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

const generateRandomId = () => {
  const id = Math.floor(Math.random() * 10000000);
  return id;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing"
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing"
    });
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique"
    });
  }

  console.log("body.name:" + body.name);

  const person = {
    name: body.name,
    number: body.number,
    id: generateRandomId()
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
