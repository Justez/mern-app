export const setLoading = payload => ({
  type: 'SET_LOADING',
  payload
})

export const setRecipes = recipes => ({
  type: 'SET_RECIPES',
  payload: recipes
})

export const selectRecipe = recipe => ({
  type: 'SET_RECIPE',
  payload: recipe
})

export const clearRecipe = () => ({
  type: 'CLEAR_RECIPE'
})

export const setQuery = query => ({
  type: 'SET_QUERY',
  payload: query
})