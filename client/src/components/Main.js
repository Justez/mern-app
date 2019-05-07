import React from 'react';
import { connect } from 'react-redux'
import axios from 'axios';
import circles from '../circles.svg';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';

import { setLoading, setRecipes, selectRecipe } from '../redux/actions';

class Main extends React.Component {
    state = { error: '' }

    componentDidMount = () => {
        if (!this.props.recipes.length) {
            this.props.setLoading(true);
            axios.get(`https://api.edamam.com/search?q=easy&app_id=7f1be035&app_key=10f1edf5f85e444cc7f11914251feaae`)
            .then((response) => {
                const recipes = response.data.hits;
                this.props.setRecipes(recipes);
            })
            .catch(error => this.setState({ error: 'Unexpected error occured. Please try again later.'}))
            .finally(() => this.props.setLoading(false))
        }
    }

  render() {
    const { loading, recipes } = this.props;
    const { error } = this.state;

    return (
      <div>
        {loading ? 
          <img src={circles} className="App-logo" alt="logo" />
          : <div>
            {error && 
              <p style={{ color: 'red' }}>
                {error}
              </p>
            }
            {recipes.length > 0 ? 
              recipes.map(({ recipe }) => 
                <Container fluid={true} key={recipe.url}>
                  <div>
                    {recipe.label}
                  </div>
                  <Button
                    onClick={() => this.props.selectRecipe(recipe)}
                    style={{ marginRight: '2vw' }}
                  >
                    View ingredients
                  </Button>
                  <Button color="primary" onClick={() => {window.open(recipe.url,'_blank')}}>View full recipe</Button>
                </Container>
              )
              : <Container>
                  No recipes available. Please update the search above.
              </Container>
            }
            </div>
        }
          
      </div>
    );
  }
}

const mapStateToProps = ({ app: { loading, recipes }}) => ({ loading, recipes })

const mapDispatchToProps = (dispatch, ownProps) => ({
    setLoading: (value) => dispatch(setLoading(value)),
    setRecipes: (recipes) => dispatch(setRecipes(recipes)),
    selectRecipe: (recipe) => dispatch(selectRecipe(recipe)),
})

const MainConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)

export default MainConnected;