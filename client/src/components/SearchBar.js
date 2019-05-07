import React from 'react';
import { connect } from 'react-redux'

import axios from 'axios';
import Appbar from 'muicss/lib/react/appbar';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';

import { setLoading, setRecipes, setQuery } from '../redux/actions';

class SearchBar extends React.Component {
  shouldComponentUpdate(nextProps) {
      return this.props.loading !== nextProps.loading;
  }

  onSearchChange = () => {
    const { loading, setLoading, setRecipes, query } = this.props;

    if (!loading) {
        setLoading(true);
        axios.get(`https://api.edamam.com/search?q=${query}&app_id=7f1be035&app_key=10f1edf5f85e444cc7f11914251feaae`)
        .then((response) => {
            const recipes = response.data.hits;
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
    setLoading: (value) => dispatch(setLoading(value)),
    setRecipes: (recipes) => dispatch(setRecipes(recipes)),
    setQuery: (query) => dispatch(setQuery(query)),
})

const SearchBarConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar)

export default SearchBarConnected;