import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if(module.hot)
  module.hot.accept();

const controlRecipes = async function(){
  try {
    const id = window.location.hash.slice(1); //Take the id from the url hash

    if(!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    
    bookmarksView.update(model.state.bookmarks);
    
    //loading recipe
    await model.loadRecipe(id);
    
    //rendering recipe
    recipeView.render(model.state.recipe);

  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
  try {
    const query = searchView.getQuery();

    if(!query) return;

    resultsView.renderSpinner();

    //loading results
    await model.loadSearchResults(query);

    //rendering results
    resultsView.render(model.getSearchResultsPage());

    //Render initial pagination numbers
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError();
  }
};

const controlPagination = function(goToPage){
  //Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Update pagination numbers
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  model.updateServings(newServings);

  //Display recipe with new servings
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  //Add/remove bookmark
  if(model.state.recipe.bookmarked === false)
    model.addBookmark(model.state.recipe);
  else
    model.removeBookmark(model.state.recipe.id);

  //Update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
};

const initHandlers = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

initHandlers();