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
        axios.get(`/api/recipes/${query}/0`)
        .then(({ data }) => {
          const { recipes } = data;
          this.props.setRecipes(recipes);
          this.setState({ lastNode: recipes.length })
        })
        .catch(error => this.setState({ error: 'Unexpected error occured. Please try again later.'}))
        .finally(() => this.props.setLoading(false))
      } else {
        this.setState({ lastNode: this.props.recipes.length })
      }
    }

    componentDidUpdate(nextProps) {
      if (nextProps.recipes.length < this.state.lastNode) {
        this.setState({ lastNode: nextProps.recipes.length })
      }
    }

    handleLoadMore = () => {
      const { query, addRecipes } = this.props;
      const { lastNode } = this.state;
      
      this.setState({ loadMore: true });
      axios.get(`/api/recipes/${query}/${lastNode}`)
      .then((response) => {
        const { data: { recipes }} = response;
        addRecipes(recipes);
        this.setState(prevState => ({ lastNode: prevState.lastNode + recipes.length }))
      })
      .catch(error => this.setState({ error: 'Unexpected error occured. Please try again later.'}))
      .finally(() => this.setState({ loadMore: false }))
    }

  render() {
    const { loading, recipes } = this.props;
    const { error, loadMore, lastNode } = this.state;

    return (
      <div>
        {loading ? 
          <img src={circles} className="App-logo" alt="logo" />
          : <div>
            {recipes.length > 0 
              ? <div>
                  {recipes.map(recipe => 
                    <Container fluid={true} key={recipe.url} style={{ marginTop: '5vmin' }}>
                      <img src={recipe.image} />
                      <div>
                        {recipe.label}
                      </div>
                      <div>
                        <Button
                          onClick={() => this.props.selectRecipe(recipe)}
                          style={{ marginRight: '2vw' }}
                        >
                          View ingredients
                        </Button>
                        <Button color="primary" onClick={() => {window.open(recipe.url,'_blank')}}>View full recipe</Button>
                      </div>
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