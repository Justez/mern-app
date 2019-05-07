import React from 'react';
import { connect } from 'react-redux'
import axios from 'axios';
import circles from '../circles.svg';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';

import { addRecipes, setLoading, setRecipes, selectRecipe } from '../redux/actions';

class Main extends React.Component {
    state = { error: '', lastNode: 0, loadMore: false }

    componentDidMount() {
      if (!this.props.recipes.length) {
        const { query } = this.props;
        this.props.setLoading(true);
        axios.get(`https://api.edamam.com/search?q=${query}&app_id=7f1be035&app_key=10f1edf5f85e444cc7f11914251feaae`)
        .then((response) => {
          const recipes = response.data.hits;
          this.props.setRecipes(recipes);
          this.setState({ lastNode: recipes.length })
        })
        .catch(error => this.setState({ error: 'Unexpected error occured. Please try again later.'}))
        .finally(() => this.props.setLoading(false))
      } else {
        this.setState({ lastNode: this.props.recipes.length })
      }
    }

    handleLoadMore = () => {
      const { query } = this.props;
      const { lastNode } = this.state;
      
      this.setState({ loadMore: true });
      axios.get(`https://api.edamam.com/search?q=${query}&from=${lastNode}&app_id=7f1be035&app_key=10f1edf5f85e444cc7f11914251feaae`)
      .then((response) => {
        const recipes = response.data.hits;
        this.props.addRecipes(recipes);
        this.setState(prevState => ({ lastNode: prevState + recipes.length }))
      })
      .catch(error => this.setState({ error: 'Unexpected error occured. Please try again later.'}))
      .finally(() => this.setState({ loadMore: false }))
    }

  render() {
    const { loading, recipes } = this.props;
    const { error, loadMore } = this.state;

    return (
      <div>
        {loading ? 
          <img src={circles} className="App-logo" alt="logo" />
          : <div>
            {recipes.length > 0 
              ? <div>
                  {recipes.map(({ recipe }) => 
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
                  )}
                  {loadMore 
                    ? <img src={circles} className="App-logo" alt="logo" style={{ height: '3vmin', marginTop: '3vmin' }} />
                    : <Button 
                      color="accent" 
                      onClick={this.handleLoadMore}
                      style={{ marginTop: '3vmin' }}
                    >
                      load more...
                    </Button>
                  }
                  {error && 
                    <p style={{ color: 'red' }}>
                      {error}
                    </p>
                  }
                </div>
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

const mapStateToProps = ({ app: { loading, recipes, query }}) => ({ loading, recipes, query })

const mapDispatchToProps = (dispatch, ownProps) => ({
    addRecipes: (recipes) => dispatch(addRecipes(recipes)),
    setLoading: (value) => dispatch(setLoading(value)),
    setRecipes: (recipes) => dispatch(setRecipes(recipes)),
    selectRecipe: (recipe) => dispatch(selectRecipe(recipe)),
})

const MainConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)

export default MainConnected;