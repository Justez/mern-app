const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const apiFunctions = require("../utils/api");

const uri = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@recipes-jk8m9.mongodb.net/app?retryWrites=true`;
const db = mongoose.connection;

mongoose.connect(uri, { useNewUrlParser: true });

db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

router.get('/recipes/:query/:from', function(req, res, next) {
  try {
    const { query, from } = req.params;
    
    db.collection("recipes").find({ query: req.params.query }).skip(+req.params.from).limit(10).toArray(function(err, result) {
      if (err) throw err;
      if (result.length) {
        res.status(200).json({ recipes: result });
      } else {
        (async function getRecipes() {
          let existed = [];
          if (+req.params.from) { // add more
            existed = await db.collection("recipes").find({ query: req.params.query }, { uri: 1, ingredientLines: 0 }).limit(+req.params.from).toArray()
            existed = existed.map(e => e.uri)
          }
          // bulk upload
          let { status, recipes, error } = await apiFunctions.getRecipes(req.params.query, req.params.from)
          if (recipes && recipes.length) {
            
            recipes = recipes.map(({ recipe: { uri, label, image, calories, ingredientLines, source, url }}) => ({ query, uri, label, image, calories, ingredientLines, source, url }))
            recipes = recipes.filter(recipe => !existed.includes(recipe.uri));
            await db.collection("recipes").insertMany(recipes);
            res.status(status).json({ recipes });
          } else {
            res.status(status).json({ recipes: [] });
          }
        })();
      }
    });
  } catch (e) {
    next(e) 
  }
});

module.exports = router;