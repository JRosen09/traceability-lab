const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

const students = ["Jimmy", "Timothy", "Jimothy"];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/api/students", (req, res) => {
  res.status(200).send(students);
});

app.post("/api/students", (req, res) => {
  let { name } = req.body;

  const index = students.findIndex((student) => {
    return student === name;
  });

  try {
    if (index === -1 && name !== "") {
      students.push(name);
      //rollbar
      rollbar.log("student was added successfully");
      res.status(200).send(students);
    } else if (name === "") {
      rollbar.error("no name was provided");
      res.status(400).send("You must enter a name.");
    } else {
      //rollbar
      rollbar.error("student is already in array");
      res.status(400).send("That student already exists.");
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/students/:index", (req, res) => {
  const targetIndex = +req.params.index;

  students.splice(targetIndex, 1);
  //rollbar
  rollbar.info("student was deleted");
  res.status(200).send(students);
});

const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server listening on ${port}`));
