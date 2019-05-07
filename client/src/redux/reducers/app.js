import { initState } from '../initState';
import { selectRecipe } from '../actions/index';

const todos = (state = initState, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_RECIPES':
      return {
        ...state,
        recipes: action.payload,
      }
    case 'ADD_RECIPES':
      return {
        ...state,
        recipes: [...state.recipes, ...action.payload]
      }
    case 'SET_RECIPE': 
      return {
        ...state,
        selectedRecipe: action.payload,
      }
    case 'CLEAR_RECIPE':
      return {
        ...state,
        selectedRecipe: undefined
      }
    case 'SET_QUERY':
      return {
        ...state,
        query: action.payload
      }
    default:
      return state
  }
}

export default todos