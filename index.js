require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.static("build"));
app.use(express.json());
app.use(cors());

const Person = require("./models/person");

morgan.token("data", function(request, response) {
  if (request.method === "POST") return JSON.stringify(request.body);
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :data")
);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to phonebook</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then(result => {
    res.json(result.map(person => person.toJSON()));
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.get("/info", (req, res) => {
  var timestap = new Date().toString();
  Person.find({}).then(result => {
    res.send(
      `<p>Phonebook has info for ${result.length} people</p>\n ${timestap}`
    );
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

const generateRandomId = () => {
  const id = Math.floor(Math.random() * 10000000);
  return id;
};

app.post("/api/persons", (request, response, next) => {
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

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateRandomId()
  });

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON());
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error("error name is : " + error);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response
      .status(400)
      .send({ error: "record with same entry already present" });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
