/*

Use /apiTester for visually testing CRUD operations.

*/

const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let catlist = [];
let id = 0;

app.use(express.static(path.join(__dirname, "public")));
app.set("views", __dirname);
app.set("view engine", "pug");

app.get("/apiTester", (req, res) => {
  res.render("main", { catlist });
});

app.get("/", (req, res) => {
  res.json(catlist);
});

app.post("/", (req, res) => {
  let cat = req.body;
  if (
    cat.name == undefined ||
    cat.age == undefined ||
    cat.breed == undefined ||
    !cat.name ||
    !cat.breed
  )
    return res.status(400).json({
      message: "Please provide all details (name, age, breed)",
    });
  cat.age = parseInt(cat.age);
  cat.name = String(cat.name);
  cat.breed = String(cat.breed);
  cat.id = ++id;
  catlist.push(cat);
  res.json({ message: "Success", cat });
});

app.get("/:id", (req, res) => {
  let cat = catlist.find((cat) => cat.id == req.params.id);
  if (cat) return res.json(cat);
  return res.json([]);
});

app.put("/:id", (req, res) => {
  let cat = catlist.find((cat) => cat.id == req.params.id);
  if (cat == undefined)
    return res.json({ message: `Cat with id ${req.params.id} does not exist` });
  let update = req.body;
  cat.age = update.age ? parseInt(update.age) : cat.age;
  cat.breed = update.breed ? String(update.breed) : cat.breed;
  cat.name = update.name ? String(update.name) : cat.name;
  res.json({ message: "Success", cat });
});

app.delete("/:id", (req, res) => {
  let origLength = catlist.length;
  catlist = catlist.filter((cat) => cat.id != req.params.id);
  if (origLength == catlist.length)
    return res.json({ message: `Cat with id ${req.params.id} does not exist` });
  res.json({ message: "Success" });
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
