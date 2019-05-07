import React from 'react';
import { connect } from 'react-redux'
import './styles/Main.css';
import Main from './components/Main';
import SearchBar from './components/SearchBar';
import Recipe from './components/Recipe';

const App = ({ selectedRecipe }) => (
  <div className="App">
    <SearchBar/>
    <div className="App-main">
      {selectedRecipe ? <Recipe /> : <Main />}
    </div>
  </div>
);

const mapStateToProps = ({ app: { selectedRecipe }}) => ({ selectedRecipe })

const AppConnected = connect(mapStateToProps)(App)

export default AppConnected