import React from 'react';
import { connect } from 'react-redux'

import axios from 'axios';
import Appbar from 'muicss/lib/react/appbar';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';

import { setLoading, setRecipes, setQuery, clearRecipe } from '../redux/actions';

class SearchBar extends React.Component {
  shouldComponentUpdate(nextProps) {
      return this.props.loading !== nextProps.loading;
  }

  onSearchChange = () => {
    const { loading, setLoading, setRecipes, query, clearRecipe } = this.props;

    if (!loading) {
        clearRecipe();
        setLoading(true);
        axios.get(`/api/recipes/${query}/0`)
        .then(({ data }) => {
            const { recipes } = data;
            setRecipes(recipes);
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false))
    }
  }

  render() {
    const { loading, query, setQuery } = this.props;
    
    return (
        <div>
            <Appbar>
                <table width="100%">
                    <tbody>
                        <tr style={{ verticalAlign: 'middle' }}>
                            <td className="mui--appbar-height">React recipe search</td>
                            <td className="mui--appbar-height" style={{ textAlign: 'right', maxWidth: '15vw' }}>
                                <Input
                                    defaultValue={query}
                                    onChange={({ target: { value }}) => setQuery(value)}
                                    placeholder="Search for a recipe by ingredient:"
                                    onKeyPress={(e) => !loading && e.key === "Enter" && this.onSearchChange()}
                                />
                            </td>
                            <td className="mui--appbar-height" style={{ textAlign: 'left', width: '4vw' }}>
                                <Button 
                                    color="primary"
                                    disabled={loading}
                                    onClick={this.onSearchChange}
                                >
                                    <span>🔍</span>
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Appbar>
        </div>
    );
  }
}

const mapStateToProps = ({ app: { loading, query }}) => ({ loading, query });

const mapDispatchToProps = (dispatch, ownProps) => ({
    clearRecipe: () => dispatch(clearRecipe()),
    setLoading: (value) => dispatch(setLoading(value)),
    setRecipes: (recipes) => dispatch(setRecipes(recipes)),
    setQuery: (query) => dispatch(setQuery(query))
})

const SearchBarConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar)

export default SearchBarConnected;