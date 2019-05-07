import React from 'react';
import { connect } from 'react-redux'
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import { clearRecipe } from '../redux/actions';

const Recipe = ({ clearRecipe, selectedRecipe: recipe }) => {
    return ( 
        <div>
            <Container fluid={true}>
                <p>
                    {recipe.label}
                </p>
                <p>
                    <i>
                        Recipe source:  <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.source}</a>
                    </i>
                </p>
                <Container>
                    <ul style={{ listStyle: 'none' }}>
                        {recipe.ingredientLines.map(line => 
                            <li>{line}</li>
                        )}
                    </ul>
                    {recipe.calories && 
                        <p>
                            Calories: {Math.round(recipe.calories)}
                        </p>
                    }
                </Container>
                
                <Button onClick={clearRecipe}>Back to search</Button>
                <Button color="primary" onClick={() => {window.open(recipe.url,'_blank')}}>View baking instructions</Button>
            </Container>
        </div>
    )
}

const mapStateToProps = ({ app: { selectedRecipe }}) => ({ selectedRecipe })

const mapDispatchToProps = (dispatch, ownProps) => ({
    clearRecipe: () => dispatch(clearRecipe())
})

const RecipeConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Recipe)

export default RecipeConnected;