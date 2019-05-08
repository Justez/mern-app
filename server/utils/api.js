const axios = require("axios");

async function getRecipes(query, from) {
  return await new Promise(resolve => {
    axios.get(`https://api.edamam.com/search?q=${query}&from=${from}&to=${+from + 10}&app_id=${process.env.RECIPE_APP_ID}&app_key=${process.env.RECIPE_APP_SECRET}`)
    .then((response) => {
        const recipes = response.data.hits;
        resolve({ status: 200, recipes });
    })
    .catch(error => resolve({ status: 500, error }))
  })
}

module.exports = {
  getRecipes,
};