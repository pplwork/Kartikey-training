const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const messages = require("express-messages");
const articles = require("./routes/articles");
const users = require("./routes/users");
const Article = require("./models/article");
const DB_CONFIG = require("./config/database");
const passport = require("passport");

mongoose.connect(DB_CONFIG.database);
let db = mongoose.connection;

db.once("open", () => {
  console.log("connected to mongoDB");
});

db.on("error", (err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = messages(req, res);
  next();
});
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) console.log(err);
    else res.render("index", { title: "Articles", articles: articles });
  });
});

//routes
app.use("/articles", articles);
app.use("/users", users);

app.listen(3000, () => console.log("server running on port 3000"));
