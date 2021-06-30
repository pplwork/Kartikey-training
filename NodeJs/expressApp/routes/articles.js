const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const User = require("../models/user");
const { check, validationResult } = require("express-validator");

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add_article", {
    title: "Add Article",
  });
});

router.delete("/:id", (req, res) => {
  if (!req.user._id) {
    res.status(500).send();
  }
  const query = { _id: req.params.id };
  Article.findById(req.params.id, (err, article) => {
    if (article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.remove(query, (err) => {
        if (err) {
          console.log(err);
          res.status(404).end();
        } else res.send("Success");
      });
    }
  });
});

router.post(
  "/add",
  check("title").not().isEmpty().withMessage("Title is required"),
  // check("author").not().isEmpty().withMessage("Author is required"),
  check("body").not().isEmpty().withMessage("Body is required"),
  (req, res) => {
    const Result = validationResult(req);
    if (!Result.isEmpty()) {
      res.render("add_article", {
        title: "Add Article",
        errors: Result.errors,
      });
    } else {
      let article = new Article();
      article.title = req.body.title;
      article.author = req.user._id;
      article.body = req.body.body;

      article.save((err) => {
        if (err) {
          console.log(err);
          return;
        } else {
          req.flash("success", "Article Added");
          res.redirect("/");
        }
      });
    }
  }
);

router.get("/edit/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (article.author != req.user._id) {
      req.flash("danger", "Not Authorized");
      res.redirect("/");
    }
    res.render("edit_article", {
      title: "Edit Article",
      article: article,
    });
  });
});

router.post("/edit/:id", ensureAuthenticated, (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  let query = { _id: req.params.id };
  Article.findOneAndUpdate(query, article, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article Updated");
      res.redirect("/");
    }
  });
});

router.get("/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    User.findById(article.author, (err, user) => {
      res.render("article", {
        title: article.title,
        author: user.name,
        body: article.body,
        id: article._id,
        authorId: user._id,
      });
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
}
module.exports = router;
